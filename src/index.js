const {
  BaseKonnector,
  log,
  requestFactory,
  saveFiles,
  addData
} = require('cozy-konnector-libs')
let request = requestFactory()
const j = request.jar()
request = requestFactory({ cheerio: false, jar: j, debug: false })

const baseUrl = 'https://www.cesu.urssaf.fr/'
const loginUrl = baseUrl + 'info/accueil.login.do'
const bulletinsUrl = baseUrl + 'decla/index.html?page=page_empl_bulletins_de_salaire&LANG=FR'


const dashboardUrl = baseUrl + 'info/accueil.html'
const menu = 'decla/index.html?page=page_empl_tableau_bord&LANG=FR'

module.exports = new BaseKonnector(start)

function start(fields) {
  return authenticate(fields.login, fields.password)
    .then(response => getCesuNumber(response))
    .then(cesuNum => getBulletinsList(cesuNum))
    .then(jsonList => constructList(jsonList))

//    .then (getBulletins)
}

function authenticate(login, password) {
  log('info', 'Authenticating...')
  return request({
    resolveWithFullResponse: true,
    method: 'POST',
    uri: loginUrl,
    form: {
      username: login,
      password: password
    }
  })
}

function getCesuNumber(response) {
  const infoCookie = j.getCookies(loginUrl).find(cookie => cookie.key === 'EnligneInfo')
  var cesuNumMatch = infoCookie.value.match('%22numerocesu%22%3A%22(.+?)%22')
  if (cesuNumMatch) {
    log('info','Cesu number found in page')
    return cesuNumMatch[1]
  } else throw new Error('')  //TODO
}

function getBulletinsList(cesuNum) {
  const url = baseUrl + 'cesuwebdec/employeurs/' + cesuNum + '/bulletinsSalaire?numInterneSalarie=&dtDebutRecherche=20130101&dtFinRecherche=20500101&numStart=0&nbAffiche=1000&numeroOrdre=0'
  return request({
    url: url,
    json: true
  })
    .then(body => body.listeObjets.filter(item => item.telechargeable === true ))
}

function constructList(jsonList) {
  var files = []
  for f in jsonList {
    console.log(f)
  } 

}
