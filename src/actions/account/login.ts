import type { BrowserContext, Page }                from 'playwright';
import { BaseSubActionClass, BaseActionInterface }  from '../BaseActionClass';
import User                                         from '../../services/user';
import type { loginActionInput }                    from '../../types/loginAction';


export default class LoginAction extends BaseSubActionClass implements BaseActionInterface
{
    public actionName   : string = "login";
    protected input     : loginActionInput;

    constructor(input:loginActionInput){
        super();
        this.input = input;
    }

    public async start(){
        try {
            let bot     = this.bot;
            let browser = this.browser;
            let page    = this.page;
            let input   = this.input;

            //-- set account name in bot
            bot.accountName = input.uname;

            //-- clear cookie
            await browser.clearCookies();

            // Set cookies in a new context
            await this.setUserCookieIfExist(input.uname)

            // go to main site
            await page.goto("https://www.instagram.com/", { timeout: 80000 });
            await bot.delay("low");

            // -- detect if is blocked in login
            var isBlock = await this.isBlocked(input);
            if (isBlock)
                throw { code: -1, mes:`Unfortunately the Account(${input.uname}) is blocked by instagram.`};

            // -- click on `Not now` notification popup
            await this.setNotNowNotification();
            await bot.delay("low");

            // -- click on `Acept` Cookie
            await this.cookieAllowAction();
            await bot.delay("low");


            // // -- if log out or cookie is unvalid  -> log in again
            if ( await this.hasLogouted() )
            {
                //-- if in mobile view and it should click on log in to show the uname and pass input
                await this.clickLoginBtnInMobileViewport()

                //-- fill the login form
                await this.fillLoginForm(input.uname,input.password);
                await bot.delay("high");


                // if login fails  -> throw error
                if (await this.isUnameOrPasswordWrong())
                    throw { code: -1, mes: `Unfortunately your uname or password is incorrect. Please double-check your uname or password.` };

                // -- detect if is blocked in login
                var isBlock = await this.isBlocked(input);
                if (isBlock)
                    throw { code: -1, mes: `Unfortunately the Account(${input.uname}) is blocked by instagram.` };

                await this.setNotNowNotification();
                await bot.delay("low");

                // if save info alert -> click not now
                await this.saveLoginInfoAlert()
                await bot.delay("medium");
                
                await this.saveUserCookie(input.uname);
            }

            bot.isLogin     = true;
            
            console.log('[ Instagram  Action -> setUserCookieAndLogin]  log in to account -> ...', input);



        } catch (e) {
            console.log('error in Action -> [setUserCookieAndLogin] ------>', e);
        }
    }



    public async setUserCookieIfExist(uname:string)
    {
        await this.page.click("text='bdfjhskcna'", { timeout: 2000 });
        var userCookie = await User.loadUserCookie(uname);
        if (userCookie) {
            const deserializedCookies = JSON.parse(userCookie)
            await this.browser.addCookies(deserializedCookies);
        };
    }

    public async isBlocked(input?:loginActionInput)
    {
        let page    = this.page;

        // -- click on no notification popup
        var hasblock = await page.$$("text=Confirm it's You to Login");
        if (hasblock && hasblock.length) {
            return true;
        }
        return false
    }



    public async setNotNowNotification()
    {
        let page = this.page;

        // -- click on no notification popup
        var hasEnablenotification = await page.$$("text=Turn on Notifications");
        if (hasEnablenotification && hasEnablenotification.length) {
            await page.click("text=Not Now", { timeout: 3000, force: false });
        }
    }

    public async hasLogouted():Promise<boolean>{
        var haslogouted = await this.page.$$("text=Log In");
        if (haslogouted && haslogouted.length)
            return true;
        return false;
    }

    public async fillLoginForm(uname:string,password:string){
        let page = this.page;
        await page.type("[name=username]", uname);
        await page.type("[name=password]", password);
        await page.click("[type=submit]");
        await this.bot.delay("low");
        await page.waitForLoadState('networkidle');
    }

    public async clickLoginBtnInMobileViewport()
    {
        var haslogouted = await this.page.$$("[name=username]");
        if (haslogouted && haslogouted.length == 0) {
            await this.page.click("text='Log In'");
            this.bot.delay("low");
        }
    }
    

    public async cookieAllowAction()
    {
        let page = this.page;
        // condition text -1
        var hasEnableAlert = await page.$$("text=Accept cookies from Instagram on this browser?");
        // condition text 2
        var hasEnableAlert2 = await page.$$("text=Allow the use of cookies by Instagram?");
        // condition text 3
        var hasEnableAlert3 = await page.$$("text=Allow the use of cookies from Instagram on this browser?");

        if (hasEnableAlert && hasEnableAlert.length) {
            var bnt = await page.$$("text=Accept");
            if (bnt[1]) {
                await bnt[1].click();
                await page.waitForLoadState('networkidle');
            }
        } else if (hasEnableAlert2 && hasEnableAlert2.length) {
            var bnt = await page.$$("text=Allow All Cookies");
            if (bnt[0]) {
                await bnt[0].click();
                await page.waitForLoadState('networkidle');
            }
        } else if (hasEnableAlert3 && hasEnableAlert3.length) {
            var bnt = await page.$$("text=Allow essential and optional cookies");
            if (bnt[0]) {
                await bnt[0].click();
                await page.waitForLoadState('networkidle');
            }
        }
    }


    public async isUnameOrPasswordWrong():Promise<boolean>{
        var hasFailedLogin = await this.page.$$("text=Sorry, your password was incorrect. Please double-check your password.");
        if (hasFailedLogin && hasFailedLogin.length)
            return true;
        return false;
    }


    


    public async saveLoginInfoAlert(){
        var hasSaveInfo = await this.page.$$("text=Save Your Login Info?");
        if (hasSaveInfo && hasSaveInfo.length) {
            await this.page.click("text=Not Now", { timeout: 3000, force: false });
        }
    }

    public async saveUserCookie(uname: string) {
        const cookies = await this.browser.cookies();
        await User.saveUserCookie(uname, JSON.stringify(cookies));
    }

    
}