// Force sentry DSN into environment variables
// In the future, will be set by the stack
process.env.SENTRY_DSN =
  process.env.SENTRY_DSN ||
  'https://5c19c465c44b4f47a304a6339c7d3887:10d2e16087214f39b6188d21d40ea577@sentry.cozycloud.cc/36'

const {
  BaseKonnector,
  log,
  requestFactory,
  saveFiles,
  errors
} = require('cozy-konnector-libs')
let request = requestFactory()
const format = require('date-fns/format')
const subYears = require('date-fns/sub_years')
const j = request.jar()
request = requestFactory({
  cheerio: false,
  jar: j
  // debug: true
})

const baseUrl = 'https://www.cesu.urssaf.fr/'
const loginUrl = baseUrl + 'info/accueil.login.do'

module.exports = new BaseKonnector(start)

async function start(fields) {
  await authenticate(fields.login, fields.password)
  const cesuNum = await getCesuNumber()
  const entries = await getBulletinsList(cesuNum)
  log('info', 'Fetching payslips')
  await saveFiles(entries, fields)
}

function authenticate(login, password) {
  log('info', 'Authenticating...')
  return request({
    method: 'POST',
    uri: loginUrl,
    form: {
      username: login,
      password: password
    },
    resolveWithFullResponse: true
  })
    .catch(err => {
      if (err.statusCode === 401) {
        if (
          err.error &&
          err.error.listeMessages &&
          err.error.listeMessages.length &&
          err.error.listeMessages[0].contenu
        ) {
          const errorMessage = err.error.listeMessages[0].contenu
          log('error', errorMessage)
          if (errorMessage.includes('Compte bloqué')) {
            throw new Error('LOGIN_FAILED.TOO_MANY_ATTEMPTS')
          }
        }
        throw new Error(errors.LOGIN_FAILED)
      } else if (err.statusCode === 500) {
        throw new Error(errors.VENDOR_DOWN)
      } else {
        throw err
      }
    })
    .then(resp => {
      log('info', 'Correctly logged in')
      return resp
    })
}

function getCesuNumber() {
  const infoCookie = j
    .getCookies(loginUrl)
    .find(cookie => cookie.key === 'EnligneInfo')
  var cesuNumMatch = infoCookie.value.match('%22numerocesu%22%3A%22(.+?)%22')
  if (cesuNumMatch) {
    log('info', 'Cesu number found in page')
    return cesuNumMatch[1]
  } else {
    log('error', 'Could not get the CESU number in the cookie')
    throw new Error(errors.VENDOR_DOWN)
  }
}

function getBulletinsList(cesuNum) {
  const debutRecherche = format(subYears(new Date(), 5), 'YYYYMMDD')
  const url =
    baseUrl +
    'cesuwebdec/employeurs/' +
    cesuNum +
    `/bulletinsSalaire?numInterneSalarie=&dtDebutRecherche=${debutRecherche}&dtFinRecherche=20500101&numStart=0&nbAffiche=1000&numeroOrdre=0`
  return request({
    url: url,
    json: true
  }).then(body => {
    return body.listeObjets
      .filter(item => item.telechargeable === true)
      .map(item => ({
        fileurl: `${baseUrl}cesuwebdec/employeurs/${cesuNum}/editions/bulletinSalairePE?refDoc=${
          item.referenceDocumentaire
        }`,
        filename: `${item.salarieDTO.nom}_${item.periode}.pdf`,
        requestOptions: {
          jar: j
        }
      }))
  })
}
