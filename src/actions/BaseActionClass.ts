import type { BrowserContext, Page } from 'playwright';
import type { logInputInterface } from '../types/baseAction'
import type bot from '../bot'

import cliProgress from 'cli-progress';
import colors      from 'ansi-colors';


export class BaseActionClass{

    protected bot           !: bot;
    protected browser       !: BrowserContext;
    protected page          !: Page;
    protected progressBar   !: cliProgress.SingleBar // progressbar in terminal

    public actionName       !: string;

    constructor()
    {
        this._setupLogAndCliProgress();
    }

    public setBrowser(bot: bot ,browser: BrowserContext, page: Page){
        this.bot     = bot;
        this.browser = browser;
        this.page    = page;
    }

    private _setupLogAndCliProgress()
    {
        // create new progress bar
        this.progressBar = new cliProgress.SingleBar({
            format: '---⎆ ' + colors.redBright("{action}") + ' |' + colors.blueBright('{bar}') + '| ' + colors.greenBright("{percentage}%")+' | ' + colors.yellow("{subAction}..."),
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            hideCursor: true
        }, cliProgress.Presets.rect);
        // initialize the bar - defining payload token "speed" with the default value "N/A"
        this.progressBar.start(100, 0, { action: " ", subAction :" "});
    }



    /* -- Log Functions --*/

    protected setLog(title:string,logInput: logInputInterface){
        let accountName = this.bot.accountName ? this.bot.accountName   : "";
        let actionName  = this.actionName      ? this.actionName        : "";

        if(this.bot.options.logScreenshot){
            this.bot.screenshot(`log-${accountName}-${actionName}-${title}`)
        }
        if(this.bot.options.log)
            this.progressBar.update(logInput.percent, { action: actionName, subAction : title});
    }
    protected completeLog(){
        let accountName = this.bot.accountName ? this.bot.accountName   : "";
        let actionName  = this.actionName      ? this.actionName        : "";

        if (this.bot.options.logScreenshot) {
            this.bot.screenshot(`log-${accountName}-${actionName}-complete`);
        }
        if (this.bot.options.log){
            this.progressBar.update(100, { action: this.actionName, subAction: colors.greenBright('✓')});
            this.progressBar.stop();
        }
    }
    protected errorLog(e:any){
        let accountName = this.bot.accountName ? this.bot.accountName   : "";
        let actionName  = this.actionName      ? this.actionName        : "";

        if (this.bot.options.logScreenshot) {
            this.bot.screenshot(`log-${accountName}-${actionName}-error`);
        }
        if (this.bot.options.log){
            this.progressBar.stop();
            console.log(colors.red("Error in action:"),colors.bgRed(this.actionName),e);
        }else
            throw e;
    }

}





export  class BaseSubActionClass  extends BaseActionClass{
}





export interface BaseActionInterface  {
    actionName:string;
    setBrowser(bot: bot, browser: BrowserContext, page: Page):void;
}