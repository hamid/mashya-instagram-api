import type { BrowserContext, Page }                from 'playwright';
import { BaseSubActionClass, BaseActionInterface }  from '../BaseActionClass';
import LoginAction                                  from './login';
import type { registerActionInput }                 from '../../types/registerAction';
import User                                         from '../../services/user';
import { birthdate }                                from '../../types/user';


// we extend from loginAction because we need its function in Register
export default class RegisterAction extends LoginAction implements BaseActionInterface
{
    public actionName        : string  = "Register";
    public needLogin         : boolean = false;
    protected input          : registerActionInput;

    constructor(input: registerActionInput){
        // call super class -> login constructor
        super({ 
            uname   : input.uname,
            password: input.password
        }); 
        this.input         = input;
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

            this.setLog("1-Opening the instagram.com", { percent: 10 });
            await this.gotoMainSite();

            this.setLog("2-Click on Acept Cookie", { percent: 15 });
            await this.cookieAllowAction();
            
            this.setLog("3-Click on sign up button", { percent: 20 });
            await this.clickSignUpButton();

            this.setLog("4-fill the register form", { percent: 25 });
            await this.fillRegisterForm();

            this.setLog("5-is form input validate", { percent: 30 });
            await this.checkValidationForm()

            this.setLog("6-fill birthdate", { percent: 35 });
            await this.fillBirthdateForm();

            this.setLog("7-Waiting for verify code ... Please set verify code in [storage/verify.txt] ", { percent: 40 });
            let verifyCode = await this.fetchAndSubmitVerifyCodeFromFile();

            this.setLog("8-verify you set is: " + verifyCode, { percent: 40 });
            let verifyStatus = await this.isVerifyCodeValid();
            if (!verifyStatus)
                throw new Error(`verify code(${input.uname}) is invalid.`);

            this.setLog("9-check unusual activity of instagram", { percent: 45 });
            await this.checkUnusualActivity();

            this.setLog("10-Save user cookie", { percent: 50 });
            await this.saveUserCookie(input.uname);

            this.setLog("11-clicking Save info button in modal to save login info to browser", { percent: 55 });
            await this.doSaveBrowserLoginInfoModal()

            this.setLog("12-Follow some suggested acount ", { percent: 60 });
            await this.FollowSuggestedAcount();




            



            bot.isLogin     = true;
            this.completeLog()

        } catch (e) {
            this.errorLog(e);
        }
    }




    private async clickSignUpButton()
    {
        await this.page.click("text='Sign up'");
        await this.bot.delay("medium");
    }


    private async fillRegisterForm() {
        let page = this.page;
        let emailOrPhoneInput: string = ""+this.input.phoneNumber.countryCode+this.input.phoneNumber.phone;
        if(this.input.registerByMail)
            emailOrPhoneInput = this.input.mail;

        await page.type("[name=emailOrPhone]", emailOrPhoneInput);
        await page.type("[name=fullName]", this.input.name+" "+this.input.family);
        await page.type("[name=username]", this.input.uname);
        await page.type("[name=password]", this.input.password);
        await page.click("[type=submit]");
        await page.waitForLoadState('networkidle');
        await this.bot.delay("high");
    }

    private async checkValidationForm(){
        var formErr = await this.page.$$("text=phone number may be incorrect");
        if (formErr && formErr.length) {
            throw new Error('Looks like your phone number may be incorrect. Please try entering your full number, including the country code.');
        } 
        var formErr2 = await this.page.$$("text=Usernames can only use");
        if (formErr2 && formErr2.length) {
            throw new Error('Usernames can only use letters, numbers, underscores and periods.');
        } 
    }

    private async fillBirthdateForm(){
        let page        = this.page;
        let birthdate   = this.input.birthdate;
        await page.selectOption("select[title='Year\\:']", birthdate.year+"");
        await this.bot.delay("low");
        await page.selectOption("select[title='Day\\:']", birthdate.day + "");
        await this.bot.delay("low");
        await page.selectOption("select[title='Month\\:']", birthdate.month + "");
        await this.bot.delay("low");
        await this.page.click("text='Next'");
        await this.bot.delay("high");
    }


    private async fetchAndSubmitVerifyCodeFromFile()
    {
        let verifyCode = await this._fetchCodefromFile();
        await this.page.type("[name=confirmationCode]", verifyCode);
        await this.bot.delay("low");
        await this.page.click("text='Confirm'");
        return verifyCode;
    }

    private async isVerifyCodeValid()
    {
        await this.bot.delay("medium");
        var hasErrorArr:any = []
        if (this.page.$$)
            hasErrorArr = await this.page.$$("text=That code isn't valid. You can request a new one.");
        else if (this.page.$$)
            hasErrorArr = await this.page.$$("text=something went wrong");
        else {
            await this.bot.delay("high");
            if (this.page.$$)
                hasErrorArr = await this.page.$$("text=That code isn't valid. You can request a new one.");
        }
        if(hasErrorArr && hasErrorArr.length)
            return false
        return true;
    }

    private async _fetchCodefromFile():Promise<string>{
        var storagePath = this.bot.options.storagePath??"";
        return new Promise(async function (resolve, reject) {
            var count   = 0;
            
            var path        = storagePath+'verify.txt';
            const fs        = require('fs');

            var timeFlag: NodeJS.Timer = setInterval(async () => {
                if (count > 100) {
                    clearInterval(timeFlag);
                    reject("");
                    throw new Error('Timeout for set verify code, Please try again and set verify code in storage/verify.txt');
                }
                if(! await fs.existsSync(path))
                     await fs.writeFileSync(path, "");
                var content = await fs.readFileSync(path, { encoding: 'utf8', flag: 'r' });
                if (content != "") {
                    fs.writeFileSync(path, "");
                    clearInterval(timeFlag);
                    return resolve(content);
                }
                count++;
            }, 4000)
        });
    };

    private async checkUnusualActivity(){
        let page                = this.page;
        var hasUnusualActivity  = await page.$$("text=Confirm it's You");
        if (hasUnusualActivity && hasUnusualActivity.length) {
            throw new Error("Unusual activity detected by instagram.Please try again.");
        }
    }












    
}