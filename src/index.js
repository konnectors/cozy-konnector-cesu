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
  saveBills,
  errors
} = require('cozy-konnector-libs')
let request = requestFactory()
const format = require('date-fns/format')
const subYears = require('date-fns/sub_years')
const parseDate = require('date-fns/parse')
const j = request.jar()
request = requestFactory({
  // debug: true,
  cheerio: false,
  jar: j
})

const baseUrl = 'https://www.cesu.urssaf.fr/'
const loginUrl = baseUrl + 'info/accueil.login.do'

module.exports = new BaseKonnector(start)

async function start(fields) {
  await authenticate(fields.login, fields.password)
  const cesuNum = getCesuNumber()
  const entries = await getBulletinsList(cesuNum)
  await saveFiles(entries, fields)
  const attestations = await getAttestationsList(cesuNum)
  await saveFiles(attestations, fields, {
    sourceAccount: this._account._id,
    sourceAccountIdentifier: fields.login
  })
  const bills = await getPrelevementsList(cesuNum)
  await saveBills(bills, fields, {
    identifiers: ['cesu'],
    sourceAccount: this._account._id,
    sourceAccountIdentifier: fields.login
  })
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
        if (password === undefined) {
          throw new Error(errors.LOGIN_FAILED)
        }
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

async function getBulletinsList(cesuNum) {
  const debutRecherche = format(subYears(new Date(), 5), 'YYYYMMDD')
  const url =
    baseUrl +
    'cesuwebdec/employeurs/' +
    cesuNum +
    `/bulletinsSalaire?numInterneSalarie=&dtDebutRecherche=${debutRecherche}&dtFinRecherche=20500101&numStart=0&nbAffiche=1000&numeroOrdre=0`
  const body = await request({
    url: url,
    json: true
  })
  return body.listeObjets
    .filter(item => item.isTelechargeable === true)
    .map(item => ({
      fileurl: `${baseUrl}cesuwebdec/employeurs/${cesuNum}/editions/bulletinSalairePE?refDoc=${item.referenceDocumentaire}`,
      filename: `${item.salarieDTO.nom}_${item.periode}.pdf`,
      requestOptions: {
        jar: j
      }
    }))
}

async function getAttestationsList(cesuNum) {
  const url =
    baseUrl + 'cesuwebdec/employeurs/' + cesuNum + `/attestationsfiscales`
  const body = await request({
    url: url,
    json: true
  })
  return body.listeObjets.map(item => ({
    fileurl:
      `${baseUrl}cesuwebdec/employeurs/${cesuNum}/editions/` +
      `attestation_fiscale_annee?periode=${item.periode}`,
    filename: `${item.periode}_attestation_fiscale.pdf`,
    requestOptions: {
      jar: j
    }
  }))
}

async function getPrelevementsList(cesuNum) {
  const debutRecherche = format(subYears(new Date(), 5), 'YYYYMMDD')
  const url =
    baseUrl +
    'cesuwebdec/employeurs/' +
    cesuNum +
    `/entetePrelevements?dtDebut=${debutRecherche}&dtFin=20500101&numeroOrdre=0&nature=`
  const body = await request({
    url: url,
    json: true
  })
  return body.listeObjets
    .filter(item => item.typeOrigine !== 'VS') // avoid future prelevements
    .map(item => ({
      fileurl:
        `${baseUrl}cesuwebdec/employeurs/${cesuNum}/editions/` +
        `avisPrelevement?reference=${item.reference}` +
        `&periode=${item.datePrelevement.substring(
          0,
          4
        )}${item.datePrelevement.substring(5, 7)}` +
        `&type=${item.typeOrigine}`,
      filename: `${item.datePrelevement}_prelevement_${item.montantAcharge}€.pdf`,
      amount: item.montantAcharge,
      date: parseDate(`${item.datePrelevement}T11:30:30`),
      vendor: 'cesu',
      vendorRef: item.reference,
      requestOptions: {
        jar: j
      }
    }))
}
