//https://www.electronjs.org/docs/latest/tutorial/automated-testing
//https://webdriver.io/docs/api/element/$/
//https://webdriver.io/docs/desktop-testing/electron/api
//https://stackoverflow.com/questions/39362292/how-do-i-set-node-env-production-on-electron-app-when-packaged-with-electron-pac
//https://www.electronjs.org/docs/latest/api/app#appispackaged-readonly

//!The testing docs are kind of weird - with importing - import('wdio-electron-service/preload');
import { browser, $ } from '@wdio/globals'

describe('Electron Testing', () => {
    it('h1 should display', async () => {
        await expect($('h1')).toBeDisplayed();
    })
    it('h1 should contain app name', async () => {
        await expect($('h1')).toHaveTextContaining('// Dionysos //');
    })
})

