import type { BrowserContext, Page } from 'playwright';
import type bot from '../bot'

export class BaseActionClass{

    protected bot       !: bot;
    protected browser   !: BrowserContext;
    protected page      !: Page;
    public actionName   !: string;

    public setBrowser(bot: bot ,browser: BrowserContext, page: Page){
        this.bot     = bot;
        this.browser = browser;
        this.page    = page;
    }

    public  getCustomError(err:any){
        if(this.bot && this.bot.options.doScreenshotInError){
            let accountName         = this.bot.accountName ? this.bot.accountName : "";
            let actionName          = this.actionName? this.actionName:"";
            let screenshotFileNAme  = `err-${accountName}-${actionName}`;
             this.bot.screenshot(screenshotFileNAme);
        }
        return err;
    }
}


export  class BaseSubActionClass  extends BaseActionClass{
}


export interface BaseActionInterface  {
    actionName:string;
    setBrowser(bot: bot, browser: BrowserContext, page: Page):void;
    getCustomError(subAction: string, message: string, err: any): Promise<Error>;
}