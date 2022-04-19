import type { BrowserContext, Page } from 'playwright';
import type { logInputInterface } from '../types/baseAction'
import type bot from '../bot'

import cliProgress from 'cli-progress';
import colors      from 'ansi-colors';


export class BaseActionClass{

    protected bot           !: bot;
    protected browser       !: BrowserContext;
    protected page          !: Page;
    

    public actionName       !: string;
    

    public setup(bot: bot, browser: BrowserContext, page: Page){
        this.setBrowser(bot,browser,page);
    }

    public setBrowser(bot: bot ,browser: BrowserContext, page: Page){
        this.bot     = bot;
        this.browser = browser;
        this.page    = page;
    }


}






export  class BaseSubActionClass  extends BaseActionClass
{
    protected progressBar      !: cliProgress.SingleBar // progressbar in terminal
    protected needLogin         : boolean = true;

    constructor() {
        super();
        this._setupLogAndCliProgress();
    }

    public setup(bot: bot, browser: BrowserContext, page: Page): void {
        super.setup(bot,browser,page);
        this.checkSubActionRequirment();
    }

    public checkSubActionRequirment() {
        if (!this.bot.isLogin && this.needLogin)
            this.errorLog(new Error("This action needs login before start."))
    }


    private _setupLogAndCliProgress() {
        // create new progress bar
        this.progressBar = new cliProgress.SingleBar({
            format: '---⎆ ' + colors.redBright("{action}") +'   |' + colors.blueBright('{bar}') + '| ' + colors.greenBright("{percentage}%") + ' | ' + colors.yellow("{subAction}..."),
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
            hideCursor: true
        }, cliProgress.Presets.rect);
        // initialize the bar - defining payload token "speed" with the default value "N/A"
        this.progressBar.start(100, 0, { action: " ", subAction: " " });
    }

    private _fillSpaceFromRight(string: string, OutputStringlength:number){
        let spaceCharCount = OutputStringlength - string.length;
        let finalOutput = string;
        for(let i=0;i<spaceCharCount;i++)
            finalOutput +=" ";
        return finalOutput;
    }



    /* -- Log Functions --*/

    protected setLog(title: string, logInput: logInputInterface) {
        let accountName = this.bot.accountName ? this.bot.accountName : "";
        let actionName = this.actionName ? this._fillSpaceFromRight(this.actionName,18) : "";

        if (this.bot.options.logScreenshot) {
            this.bot.screenshot(`log-${accountName}-${actionName}-${title}`)
        }
        if (this.bot.options.log)
            this.progressBar.update(logInput.percent, { action: actionName, subAction: title });
    }
    protected completeLog() {
        let accountName = this.bot.accountName ? this.bot.accountName  : "";
        let actionName = this.actionName ? this.actionName : "";

        if (this.bot.options.logScreenshot) {
            this.bot.screenshot(`log-${accountName}-${actionName}-complete`);
        }
        if (this.bot.options.log) {
            this.progressBar.update(100, { action: this._fillSpaceFromRight(actionName,18), subAction: colors.greenBright('✓') });
            this.progressBar.stop();
        }
    }
    protected errorLog(e: any) {
        let accountName = this.bot.accountName ? this.bot.accountName  : "";
        let actionName = this.actionName ? this.actionName : "";

        if (this.bot.options.logScreenshot) {
            this.bot.screenshot(`log-${accountName}-${actionName}-error`);
        }
        if (this.bot.options.log) {
            this.progressBar.stop();
            console.log(colors.red("Error in action:"), colors.bgRed(this.actionName), e);
        } else
            throw e;
    }

}





export interface BaseActionInterface  {
    
    actionName  : string

    setup(bot: bot, browser: BrowserContext, page: Page):void;
}