process.env.SENTRY_DSN =
  process.env.SENTRY_DSN ||
  'https://3b59f0ba64ba4a5da979b50a184e7ea8@errors.cozycloud.cc/59'

const {
  BaseKonnector,
  log,
  requestFactory,
  saveFiles,
  saveBills,
  errors,
  cozyClient
} = require('cozy-konnector-libs')
let request = requestFactory()

const models = cozyClient.new.models
const { Qualification } = models.document

const { format, subYears } = require('date-fns')
const j = request.jar()
request = requestFactory({
  // debug: true,
  cheerio: false,
  jar: j,
  headers: {
    'User-Agent':
      'Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0'
  }
})

const baseUrl = 'https://www.cesu.urssaf.fr/'
const loginUrl = baseUrl + 'info/accueil.login.do'

module.exports = new BaseKonnector(start)

async function start(fields) {
  await authenticate(fields.login, fields.password)
  const cesuNum = getCesuNumber()
  const entries = await getBulletinsList(cesuNum)
  let total = entries.length
  if (entries.length) {
    await saveBills(entries, fields, {
      sourceAccount: this.accountId,
      sourceAccountIdentifier: fields.login,
      fileIdAttributes: ['vendorRef'],
      keys: ['vendorRef'],
      concurrency: 4,
      linkBankOperations: false
    })
  }
  const bsalaireEmploye = await getEmployeBulletinsList(cesuNum)
  total += bsalaireEmploye.length
  if (bsalaireEmploye.length)
    await saveBills(bsalaireEmploye, fields, {
      sourceAccount: this.accountId,
      sourceAccountIdentifier: fields.login,
      fileIdAttributes: ['vendorRef'],
      keys: ['vendorRef'],
      concurrency: 4,
      linkBankOperations: false
    })
  const attestations = await getAttestationsList(cesuNum)
  total += attestations.length
  if (bsalaireEmploye.length)
    await saveFiles(attestations, fields, {
      sourceAccount: this.accountId,
      sourceAccountIdentifier: fields.login,
      fileIdAttributes: ['cesuNum', 'year']
    })
  const bills = await getPrelevementsList(cesuNum)
  total += bills.length
  if (bills.length) {
    await saveBills(bills, fields, {
      sourceAccount: this.accountId,
      sourceAccountIdentifier: fields.login,
      fileIdAttributes: ['vendor', 'vendorRef'],
      keys: ['vendorRef'],
      linkBankOperations: false,
      requestInstance: request
    })
  }

  if (!total) log('warn', 'could not find any document for this account')
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
  const debutRecherche = format(subYears(new Date(), 5), 'yyyyMMdd')
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
      filename: `${item.salarieDTO.nom}_${item.salarieDTO.prenom}_${format(
        new Date(item.dtDebut),
        'yyyy-MM'
      )}_${item.salaireNet}EUR.pdf`,
      shouldReplaceName: `${item.salarieDTO.nom}_${item.periode}.pdf`,
      amount: parseFloat(item.salaireNet),
      date: new Date(item.dtFin),
      vendorRef: item.referenceDocumentaire,
      employee: `${item.salarieDTO.nom}_${item.salarieDTO.prenom}`,
      fileAttributes: {
        metadata: {
          contentAuthor: 'cesu.urssaf.fr',
          issueDate: new Date(),
          carbonCopy: true,
          qualification: Qualification.getByLabel('pay_sheet')
        }
      },
      requestOptions: {
        jar: j
      },
      vendor: 'cesu',
      matchingCriterias: {
        labelRegex: '.*' // we do not have any information on operation label
      }
    }))
}

async function getEmployeBulletinsList(cesuNum) {
  const debutRecherche = format(subYears(new Date(), 5), 'yyyyMMdd')
  const url =
    baseUrl +
    'cesuwebdec/salaries/' +
    cesuNum +
    `/bulletinsSalaire?pseudoSiret=&dtDebutRecherche=${debutRecherche}&dtFinRecherche=20500101&numStart=0&nbAffiche=1000&numeroOrdre=0&orderBy=orderByRefDoc`
  const body = await request({
    url: url,
    json: true
  })

  return body.listeObjets
    .filter(item => item.isTelechargeable === true)
    .map(item => ({
      fileurl: `${baseUrl}cesuwebdec/salaries/${cesuNum}/editions/bulletinSalairePE?refDoc=${item.referenceDocumentaire}`,
      filename: `${format(new Date(item.dtDebut), 'yyyy-MM')}_${
        item.salaireNet
      }EUR.pdf`,
      amount: parseFloat(item.salaireNet),
      isRefund: true,
      date: new Date(item.dtFin),
      vendorRef: item.referenceDocumentaire,
      subPath: `${item.employeurDTO.nom}_${item.employeurDTO.prenom}`,
      fileAttributes: {
        metadata: {
          contentAuthor: 'cesu.urssaf.fr',
          issueDate: new Date(),
          carbonCopy: true,
          qualification: Qualification.getByLabel('pay_sheet')
        }
      },
      requestOptions: {
        jar: j
      },
      vendor: 'cesu',
      matchingCriterias: {
        labelRegex: '.*' // we do not have any information on operation label
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
    cesuNum,
    year: item.periode,
    filename: `${item.periode}_attestation_fiscale.pdf`,
    fileAttributes: {
      metadata: {
        contentAuthor: 'cesu.urssaf.fr',
        issueDate: new Date(),
        carbonCopy: true,
        qualification: Qualification.getByLabel('other_tax_document')
      }
    },
    requestOptions: {
      jar: j
    }
  }))
}

async function getPrelevementsList(cesuNum) {
  const debutRecherche = format(subYears(new Date(), 5), 'yyyyMMdd')
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
      date: new Date(`${item.datePrelevement}T11:30:30`),
      vendor: 'cesu',
      vendorRef: item.reference,
      fileAttributes: {
        metadata: {
          contentAuthor: 'cesu.urssaf.fr',
          issueDate: new Date(),
          carbonCopy: true,
          qualification: Qualification.getByLabel('tax_notice')
        }
      },
      requestOptions: {
        jar: j
      }
    }))
}
