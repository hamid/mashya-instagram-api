import type { optionsInterface } from '../src/types/bot'
import { BROWSER } from '../src/types/bot'
import {chromium, firefox, webkit,}   from 'playwright';
import type { BrowserType, BrowserContext, Page } from 'playwright';
import colors from 'ansi-colors';

// load actions
import Account, { AccountInterface }    from './actions/account/AccountClass';
import Post,{ PostInterface}            from './actions/post/PostClass'




 export default class MashyaInstagramBot
 {

     
     private _defaultDevOptions: optionsInterface ={
         isDevelopment:true,
         browser: BROWSER.chromium,
         headless:false,
         slowMo:10,
         log:true,
         logScreenshot:true,
         chromiumSandbox: true,
         locale: 'en-US',
     }
     private _defaultPrdOptions: optionsInterface ={
         isDevelopment:false,
         browser: BROWSER.chromium,
         headless:true,
         slowMo:300,
         log: true,
         logScreenshot: false,
         chromiumSandbox: true,
         locale: 'en-US',
     }
     public  options: optionsInterface = { ...this._defaultDevOptions };
     private browserPersistentContextPrefix : string = "instagram";
     private browser       !: BrowserContext;
     private browserPage   !: Page;

     /* -- Bot State -- */
     public isLogin        : boolean        = false;
     public accountName    : string | null  = null;

     /* -- actions -- */
     public account        !:  Account;
     public post           !:  Post;



     constructor(options: optionsInterface){
             let mergedOption = this._mergeOptions(options);
             this.options     = mergedOption;
     }


     private _mergeOptions(options: optionsInterface): optionsInterface
     {
         if(options.isDevelopment)
            return {...this._defaultDevOptions, ...options};
        else
             return { ...this._defaultPrdOptions, ...options };
     }
     
     private async _createBrowserBot(){
         this._createAsciiTextInConsole();
         let browserObj         = { chromium,webkit,firefox };
         let browserContextName = "./storage/"+this.browserPersistentContextPrefix + "-" +this.options.botName;
         this.browser          = await browserObj[this.options.browser!].launchPersistentContext(browserContextName,this.options);
         this.browserPage      = await this.browser.newPage();
         // await page.screenshot({ path: `example.png` });
        //  await browser.close();
     }

     private async _loadMainActions(){
         this.account = new Account();
         this.account.setBrowser(this,this.browser,this.browserPage);

         this.post = new Post();
         this.post.setBrowser(this,this.browser,this.browserPage);
     }


     public async start(){
         await this._createBrowserBot();
         await this._loadMainActions();
     }

     public async delay(delayExpression:string | number){

         var constantDelay:number = 1000;
         var extraDelay:number      = 0;

         switch (delayExpression) {
            case "low":
                 extraDelay = 1000;
                break;
            case "medium":
                 extraDelay = 5000;
                 constantDelay = 2000;
                break;
            case "high":
                 extraDelay = 5000;
                 constantDelay = 4000;
                break;
            default:
                 extraDelay = <number>delayExpression;
        }
         await this.browserPage.waitForTimeout(Math.floor(Math.random() * extraDelay) + constantDelay);
     }

     public async hasLogin():Promise<boolean>{
         if (this.isLogin)
            return true;
        return false;
     }

     public async screenshot(filename:string){
         await this.browserPage.screenshot({ path: `./screenshot/${filename}.jpg` });
     }

     public async _createAsciiTextInConsole(){
         let botname = colors.magentaBright(this.options.botName??"");
         console.log(`

-------------------------
.   ,         .
|\\ /|         |
| V | ,-: ,-. |-. . . ,-:
|   | | | \`-. | | | | | |
'   ' \`-\` \`-' ' ' \`-| \`-\`
                  \`-'     
-------------------------
     Instagram  Bot
.........................
-⎆ ${botname} 
-------------------------

`);
     }
    
    


}





