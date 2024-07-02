import { ContentScript } from 'cozy-clisk/dist/contentscript'
import Minilog from '@cozy/minilog'
const log = Minilog('ContentScript')
Minilog.enable('cesuCCC')

const BASE_URL = 'https://www.cesu.urssaf.fr'

class TemplateContentScript extends ContentScript {
  onWorkerReady() {
    window.addEventListener('DOMContentLoaded', () => {
      const button = document.querySelector('input[type=submit]')
      if (button) {
        button.addEventListener('click', () =>
          this.bridge.emit('workerEvent', { event: 'loginSubmit' })
        )
      }
      const error = document.querySelector('.error')
      if (error) {
        this.bridge.emit('workerEvent', {
          event: 'loginError',
          payload: { msg: error.innerHTML }
        })
      }
    })
  }

  onWorkerEvent({ event, payload }) {
    if (event === 'loginSubmit') {
      this.log('info', 'received loginSubmit, blocking user interactions')
      this.blockWorkerInteractions()
    } else if (event === 'loginError') {
      this.log(
        'info',
        'received loginError, unblocking user interactions: ' + payload?.msg
      )
      this.unblockWorkerInteractions()
    }
  }

  async navigateToLoginForm() {
    this.log('info', '🤖 navigateToLoginForm')
    await this.goto(BASE_URL)
  }

  async ensureAuthenticated({ account }) {
    this.bridge.addEventListener('workerEvent', this.onWorkerEvent.bind(this))
    this.log('info', '🤖 ensureAuthenticated')
    await this.navigateToLoginForm()
    return true
  }

  async ensureNotAuthenticated() {
    this.log('info', '🤖 ensureNotAuthenticated')
    await this.navigateToLoginForm()
    const authenticated = await this.runInWorker('checkAuthenticated')
    if (!authenticated) {
      return true
    }
    return true
  }

  async checkAuthenticated() {}

  async showLoginFormAndWaitForAuthentication() {
    log.debug('showLoginFormAndWaitForAuthentication start')
    await this.setWorkerState({ visible: true })
    await this.runInWorkerUntilTrue({
      method: 'waitForAuthenticated'
    })
    await this.setWorkerState({ visible: false })
  }

  async fetch(context) {
    this.log('info', '🤖 fetch')
    const identity = await this.runInWorker('parseIdentity')
    await this.saveIdentity(identity)
  }

  async getUserDataFromWebsite() {
    this.log('info', '🤖 getUserDataFromWebsite')
    return {
      sourceAccountIdentifier: 'defaultTemplateSourceAccountIdentifier'
    }
  }
}

const connector = new TemplateContentScript()
connector.init({ additionalExposedMethodsNames: [''] }).catch(err => {
  log.warn(err)
})
