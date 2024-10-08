/* eslint-disable no-console */
import {
  ContentScript,
  RequestInterceptor
} from 'cozy-clisk/dist/contentscript'

const { format, subYears } = require('date-fns')
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
    identifier: 'employees',
    method: 'GET',
    url: '/cesuwebdec/salariesTdb?pseudoSiret=',
    serialization: 'json'
  },
  {
    identifier: 'withdrawals',
    method: 'GET',
    url: '/recapprelevements',
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
      if (authenticated) {
        this.log('info', 'Already connected, continue ...')
        return true
      } else {
        await this.autoLogin(credentials)
        await this.waitForElementInWorker('#deconnexion_link_mobile')
        this.log('info', 'autoLogin succeeded')
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
    if (formElement) {
      return false
    } else if (logoutButton) {
      this.log('info', 'Auth check succeeded')
      return true
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
    const declarations = await this.getDeclarations()
    await this.saveFiles(declarations, {
      context,
      fileIdAttributes: ['vendorRef'],
      contentType: 'application/pdf',
      qualificationLabel: 'pay_sheet'
    })
    await this.waitForElementInWorker('[pause]')
    await this.getIdentity()
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

  async getDeclarations() {
    this.log('info', '📍️ getDeclarations starts')
    await this.runInWorker('click', '#page_empl_mes_declarations')
    await Promise.all([
      this.waitForElementInWorker('#mesDeclarations'),
      this.waitForRequestInterception('declarations')
    ])
    const declarations = this.store.declarations.payload
    const cesuNum = declarations.url.match(
      /cesuwebdec\/employeurs\/(.*)\/declarationsby/
    )[1]
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
