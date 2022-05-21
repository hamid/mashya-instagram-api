export interface optionsInterface {
    isDevelopment   : boolean
    botName        ?: string
    browser        ?: BROWSER
    headless       ?: boolean
    slowMo         ?: number
    log            ?: boolean
    logScreenshot  ?: boolean
    chromiumSandbox?: boolean
    locale         ?: string
    storagePath     ?: string

}
export enum BROWSER {
    chromium    =   "chromium",
    webkit      =   "webkit",
    firefox     =   "firefox",
}
