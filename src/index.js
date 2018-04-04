const {
  BaseKonnector,
  log,
  requestFactory,
  saveFiles
} = require('cozy-konnector-libs')
let request = requestFactory()
const j = request.jar()
request = requestFactory({
  cheerio: false,
  jar: j,
  debug: false
})

const baseUrl = 'https://www.cesu.urssaf.fr/'
const loginUrl = baseUrl + 'info/accueil.login.do'

module.exports = new BaseKonnector(start)

function start(fields) {
  return authenticate(fields.login, fields.password)
    .then(response => getCesuNumber(response))
    .then(cesuNum => getBulletinsList(cesuNum))
    .then(entries => {
      log('info', 'Fetching payslips')
      return saveFiles(entries, fields)
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
    }
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
  } else throw new Error('') // TODO
}

function getBulletinsList(cesuNum) {
  const url =
    baseUrl +
    'cesuwebdec/employeurs/' +
    cesuNum +
    '/bulletinsSalaire?numInterneSalarie=&dtDebutRecherche=20130101&dtFinRecherche=20500101&numStart=0&nbAffiche=1000&numeroOrdre=0'
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

// function constructList(jsonList) {
//   var files = []
//   for f in jsonList {
//     console.log(f)
//   }

// }
