/* eslint-disable no-console */
import {
  ContentScript,
  RequestInterceptor
} from 'cozy-clisk/dist/contentscript'

const { format } = require('date-fns')
import Minilog from '@cozy/minilog'
const log = Minilog('ContentScript')
Minilog.enable('cesuCCC')

// Necessary here because they are using this function and the are not supported by the webview
console.groupCollapsed = function () {}
console.groupEnd = function () {}

const baseUrl = 'https://www.cesu.urssaf.fr/'
const loginFormUrl =
  'https://www.cesu.urssaf.fr/decla/index.html?page=page_se_connecter&LANG=FR'
const dashboardUrl =
  'https://www.cesu.urssaf.fr/decla/index.html?page=page_empl_tableau_bord&LANG=FR'

const requestInterceptor = new RequestInterceptor([
  {
    identifier: 'authentication',
    method: 'POST',
    url: '/cesuwebdec/authentication',
    serialization: 'json'
  },
  {
    identifier: 'userIdentity',
    method: 'GET',
    url: '/cesuwebdec/employeursIdentite/',
    serialization: 'json'
  },
  {
    identifier: 'declarations',
    method: 'GET',
    url: '/declarationsby?',
    serialization: 'json'
  },
  {
    identifier: 'attestations',
    method: 'GET',
    url: '/attestationsfiscales',
    serialization: 'json'
  },
  {
    identifier: 'prelevements',
    method: 'GET',
    url: '/entetePrelevements',
    serialization: 'json'
  },
  {
    identifier: 'payslips',
    method: 'GET',
    url: '/bulletinSalaires',
    serialization: 'json'
  }
])
requestInterceptor.init()

class CesuContentScript extends ContentScript {
  async onWorkerReady() {
    await this.waitForElementNoReload('#connexion')
    this.watchLoginForm.bind(this)()
  }

  onWorkerEvent({ event, payload }) {
    if (event === 'loginSubmit') {
      this.log('info', `User's credential intercepted`)
      const { login, password } = payload
      this.store.userCredentials = { login, password }
    }
    if (event === 'requestResponse') {
      const { identifier } = payload
      this.log('debug', `${identifier} request intercepted`)
      this.store[identifier] = { payload }
      if (identifier === 'authentication') {
        this.store.cesuNum = payload.response.objet.numero
      }
    }
  }

  watchLoginForm() {
    this.log('info', '📍️ watchLoginForm starts')
    const loginField = document.querySelector('#identifiantCompte')
    const passwordField = document.querySelector('#motPasseCompte')
    if (loginField && passwordField) {
      this.log('info', 'Found credentials fields, adding form listener')
      const loginForm = document.querySelector('#connexion')
      loginForm.addEventListener('submit', () => {
        const login = loginField.value
        const password = passwordField.value
        const event = 'loginSubmit'
        const payload = { login, password }
        this.bridge.emit('workerEvent', {
          event,
          payload
        })
      })
    }
  }

  async navigateToLoginForm() {
    this.log('info', '🤖 navigateToLoginForm')
    await this.goto(loginFormUrl)
    await this.waitForElementInWorker('#connexion')
  }

  async navigateToDashboardPage() {
    this.log('info', '🤖 navigateToDashboardPage')
    await this.goto(dashboardUrl)
    // If connected, reaches the user dashBoard, if not leads to the loginForm with an error element saying you need to be connected
    // We're waiting for this element because it mess with the form in a way autoFill is not working properly
    await Promise.race([
      this.waitForElementInWorker('#notification > .alert-danger'),
      this.waitForElementInWorker('#deconnexion_link_mobile')
    ])
  }

  async ensureAuthenticated({ account }) {
    this.bridge.addEventListener('workerEvent', this.onWorkerEvent.bind(this))
    this.log('info', '🤖 ensureAuthenticated')
    const credentials = await this.getCredentials()

    if (!account || !credentials) {
      await this.ensureNotAuthenticated()
      await this.showLoginFormAndWaitForAuthentication()
    } else {
      await this.navigateToDashboardPage()
      const authenticated = await this.runInWorker('checkAuthenticated')
      this.store.isEmployer = authenticated === 'employer'
      if (authenticated) {
        this.log('info', `Already connected as ${authenticated}, continue ...`)
        return true
      } else {
        await this.autoLogin(credentials)
        await this.waitForElementInWorker('#deconnexion_link_mobile')
        const autoAuth = await this.runInWorker('checkAuthenticated')
        this.store.isEmployer = autoAuth === 'employer'
        this.log('info', `autoLogin succeeded as ${autoAuth}`)
      }
    }
    return true
  }

  async autoLogin(credentials) {
    this.log('info', '📍️ autoLogin starts')
    // We need to wait for the hcaptcha to appears otherwise login failed
    await this.waitForElementInWorker('#hrecaptchaId')
    await this.runInWorker('fillText', '#identifiantCompte', credentials.login)
    await this.runInWorker('fillText', '#motPasseCompte', credentials.password)
    await this.runInWorker('click', '#connexion_button')
  }

  async ensureNotAuthenticated() {
    this.log('info', '🤖 ensureNotAuthenticated')
    await this.navigateToLoginForm(loginFormUrl)
    const authenticated = await this.runInWorker('checkAuthenticated')
    if (!authenticated) {
      return true
    }
    await this.runInWorker('click', '#deconnexion_link_mobile')
    await this.waitForElementInWorker('#page_se_connecter_link_i1')
    return true
  }

  async checkAuthenticated() {
    this.log('info', '📍️ checkAuthenticated starts')
    const formElement = document.querySelector('#connexion')
    const logoutButton = document.querySelector('#deconnexion_link_mobile')
    const declaElement = document.querySelector('#page_empl_mes_declarations')
    if (formElement) {
      return false
    } else if (logoutButton && declaElement) {
      this.log('info', 'Auth check succeeded - Employer account')
      return 'employer'
    } else if (logoutButton && !declaElement) {
      this.log('info', 'Auth check succeeded - Probably employee account')
      return 'employee'
    }
    return false
  }

  async showLoginFormAndWaitForAuthentication() {
    this.log('info', 'showLoginFormAndWaitForAuthentication start')
    await this.setWorkerState({ visible: true })
    await this.runInWorker('scrollFormIntoView')
    await this.runInWorkerUntilTrue({
      method: 'waitForAuthenticated'
    })
    await this.setWorkerState({ visible: false })
  }

  async fetch(context) {
    this.log('info', '🤖 fetch')
    if (this.store.userCredentials) {
      await this.saveCredentials(this.store.userCredentials)
    }
    const cesuNum = this.store.cesuNum
    if (this.store.isEmployer) {
      this.log('info', 'Employer account')
      const declarations = await this.getDeclarations(cesuNum)
      await this.saveFiles(declarations, {
        context,
        fileIdAttributes: ['vendorRef'],
        contentType: 'application/pdf',
        qualificationLabel: 'pay_sheet'
      })
      const attestations = await this.getAttestations(cesuNum)
      await this.saveFiles(attestations, {
        context,
        fileIdAttributes: ['cesuNum', 'year'],
        contentType: 'application/pdf',
        qualificationLabel: 'other_tax_document'
      })
      const prelevements = await this.getPrelevements(cesuNum)
      await this.saveFiles(prelevements, {
        context,
        fileIdAttributes: ['vendor', 'vendorRef'],
        contentType: 'application/pdf',
        qualificationLabel: 'tax_notice'
      })
      await this.getIdentity()
    } else {
      this.log('info', 'Employee acount')
      const employeePayslip = await this.getEmployeePayslips(cesuNum)
      await this.saveFiles(employeePayslip, {
        context,
        fileIdAttributes: ['vendorRef'],
        contentType: 'application/pdf',
        qualificationLabel: 'pay_sheet'
      })
      // Regarding the state of the intercepted response for the identity, we assume it will be different for an employee
      // so for now, we're not fetching any identity for this type of account
    }
  }

  async getUserDataFromWebsite() {
    this.log('info', '🤖 getUserDataFromWebsite')
    const credentials = await this.getCredentials()
    const credentialsLogin = credentials?.login
    const storeLogin = this.store?.userCredentials?.login

    // prefer credentials over user email since it may not be know by the user
    let sourceAccountIdentifier = credentialsLogin || storeLogin
    if (!sourceAccountIdentifier) {
      throw new Error('Could not get a sourceAccountIdentifier')
    }
    return {
      sourceAccountIdentifier: sourceAccountIdentifier
    }
  }

  async getDeclarations(cesuNum) {
    this.log('info', '📍️ getDeclarations starts')
    await this.goto(
      'https://www.cesu.urssaf.fr/decla/index.html?page=page_empl_mes_declarations&LANG=FR'
    )
    // sometimes one resolve before the other and vice versa so wait for both of them
    await Promise.all([
      this.waitForElementInWorker('#mesDeclarations'),
      this.waitForRequestInterception('declarations')
    ])
    const declarations = this.store.declarations.payload
    // const cesuNum = declarations.url.match(
    //   /cesuwebdec\/employeurs\/(.*)\/declarationsby/
    // )[1]
    return declarations.response.listeObjets
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
            carbonCopy: true
          }
        },
        vendor: 'cesu'
      }))
  }

  async getAttestations(cesuNum) {
    this.log('info', '📍️ getAttestations starts')
    await this.goto(
      'https://www.cesu.urssaf.fr/decla/index.html?page=page_empl_avantage_fiscal&LANG=FR'
    )
    await Promise.all([
      // Selector here is not a mistake, they misspelled it on the website
      this.waitForElementInWorker('#liste_attestions_fiscales'),
      this.waitForRequestInterception('attestations')
    ])
    const attestations = this.store.attestations.payload
    // const cesuNum = attestations.url.match(
    //   /cesuwebdec\/employeurs\/(.*)\/attestationsfiscales/
    // )[1]
    return attestations.response.listeObjets.map(item => ({
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
          carbonCopy: true
        }
      }
    }))
  }

  async getPrelevements(cesuNum) {
    this.log('info', '📍️ getPrelevements starts')
    await this.goto(
      'https://www.cesu.urssaf.fr/decla/index.html?page=page_empl_mes_prelevements&LANG=FR'
    )
    await Promise.all([
      // Selector here is not a mistake, they misspelled it on the website
      this.waitForElementInWorker('#resultatsAffiches'),
      this.waitForRequestInterception('prelevements')
    ])
    const prelevements = this.store.prelevements.payload
    // const cesuNum = prelevements.url.match(
    //   /cesuwebdec\/employeurs\/(.*)\/entetePrelevements/
    // )[1]

    return prelevements.response.listeObjets
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
            carbonCopy: true
          }
        }
      }))
  }

  async getEmployeePayslips(cesuNum) {
    this.log('info', '📍️ getEmployeePayslips starts')
    // Keeping this around for when we will have the url and the exact element to wait for
    // await this.goto(
    //   'https://www.cesu.urssaf.fr/decla/index.html?page=page_empl_mes_prelevements&LANG=FR'
    // )
    // await Promise.all([
    //   // Selector here is not a mistake, they misspelled it on the website
    //   this.waitForElementInWorker('#resultatsAffiches'),
    //   this.waitForRequestInterception('payslips')
    // ])
    await this.runInWorker('click', 'a', {
      incldesText: 'Mes bulletins de salaire'
    })
    await Promise.all([
      this.waitForRequestInterception('payslips'),
      // Only thing we can be pretty sure it appears on the next page
      this.waitForElementInWorker('#filAriane')
    ])
    const payslips = this.store.payslips.payload
    return payslips.response.listeObjets
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
            carbonCopy: true
          }
        },
        vendor: 'cesu'
      }))
  }

  async getIdentity() {
    this.log('info', '📍️ getIdentity starts')
    const userData = this.store.userIdentity.payload
    // For now we can just found full name, email address and pseudoSiret
    const firstName = userData.response.objet.prenom
    const lastName = userData.response.objet.nom
    // const pseudoSiret : userData.response.objet.pseudoSiret
    const identity = {
      email: [userData.response.objet.email],
      name: {
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`
      }
    }

    await this.saveIdentity({ identity })
  }

  async scrollFormIntoView() {
    this.log('info', '📍️ scrollFormIntoView starts')
    this.log('info', 'Scrolling to view')
    document.querySelector('.se-connecter.identifiant-pc-cesu').scrollIntoView()
    document.body.classList.add('noscroll')
  }
}

const connector = new CesuContentScript({ requestInterceptor })
connector
  .init({ additionalExposedMethodsNames: ['scrollFormIntoView'] })
  .catch(err => {
    log.warn(err)
  })
