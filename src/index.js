const {
  BaseKonnector,
  log,
  requestFactory,
  saveFiles,
  addData
} = require('cozy-konnector-libs')
const request = requestFactory({ cheerio: true, jar: true, debug: true })

const baseUrl = 'https://www.cesu.urssaf.fr/info/'
const dashboardUrl = baseUrl + 'acceuil.html'
const loginUrl = baseUrl + 'accueil.login.do'

module.exports = new BaseKonnector(start)

function start(fields) {
  return authenticatefake(fields.login, fields.password)
  //    .then(printjson)
}

function printjson($) {
  //console.log($.html())
  console.log('TRY')
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

function authenticatefake(login, password) {
  log('info', 'Authenticating...')
  return request(
    {
      method: 'GET',
      uri: dashboardUrl
    } //).then( $ => { console.log($.html()) }
  )
}

// The start function is run by the BaseKonnector instance only when it got all the account
// information (fields). When you run this connector yourself in "standalone" mode or "dev" mode,
// the account information come from ./konnector-dev-config.json file
function start2(fields) {
  // The BaseKonnector instance expects a Promise as return of the function
  return request(`${baseUrl}/index.html`).then($ => {
    // cheerio (https://cheerio.js.org/) uses the same api as jQuery (http://jquery.com/)
    // here I do an Array.from to convert the cheerio fake array to a real js array.
    const entries = Array.from($('article')).map(article =>
      parseArticle($, article)
    )
    return addData(entries, 'com.toscrape.books').then(() =>
      saveFiles(entries, fields)
    )
  })
}

// The goal of this function is to parse a html page wrapped by a cheerio instance // and return an array of js objects which will be saved to the cozy by addData (https://github.com/cozy/cozy-konnector-libs/blob/master/docs/api.md#module_addData)
// and saveFiles (https://github.com/cozy/cozy-konnector-libs/blob/master/docs/api.md#savefiles)
function parseArticle($, article) {
  const $article = $(article)
  const title = $article.find('h3 a').attr('title')
  return {
    title,
    price: normalizePrice($article.find('.price_color').text()),
    url: `${baseUrl}/${$article.find('h3 a').attr('href')}`,
    // when it finds a fileurl attribute, saveFiles will save this file to the cozy with a filename
    // name
    fileurl: `${baseUrl}/${$article.find('img').attr('src')}`,
    filename: `${title}.jpg`
  }
}

// convert a price string to a float
function normalizePrice(price) {
  return parseFloat(price.trim().replace('£', ''))
}
