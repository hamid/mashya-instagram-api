import type { BrowserContext, Page }                from 'playwright';
import { BaseSubActionClass, BaseActionInterface }  from '../BaseActionClass';
import User                                         from '../../services/user';
import type { editPriofileActionInput }                    from '../../types/editProfileAction';
import colors from 'ansi-colors';


export default class EditProfileAction extends BaseSubActionClass implements BaseActionInterface
{
    public actionName   : string = "EditProfile";
    protected input     : editPriofileActionInput;

    constructor(input: editPriofileActionInput){
        super(); // --> it's important
        this.input = input;
    }

    

    public async start(){
        try {
            let bot     = this.bot;
            let browser = this.browser;
            let page    = this.page;
            let input   = this.input;

            

            this.setLog("1)goto EditProfile Page", { percent: 40 });
            await this.gotoEditProfilePage(input.uname);

            this.setLog("2)Fill edit profile input and Submit form.", { percent: 60 });
            await this.fillAndSubmitProfileForm(input);

            this.setLog("3)Upload avatar if exists", { percent: 70 });
            await this.uploadAvatarIfExist(input.avatarPath);

            this.setLog("3)Submiting form", { percent: 85 });
            await this.submitForm();

            // this.setLog("3)Check form response", { percent: 85 });
            // await this.checkValidationForm();



            this.completeLog()

        } catch (e) {
            this.errorLog(e);
        }
    }


    public async gotoEditProfilePage(uname:string){
        var unameElm = await this.page.$$("text='"+uname+"'");
        if (unameElm && unameElm.length){
            await unameElm[0].click();
            await this.page.waitForLoadState('networkidle');
        }else
            await this.page.goto("https://www.instagram.com/"+uname, { timeout: 80000 });
        this.bot.delay('medium');
        await this.page.click("text='Edit Profile'");
    }



    public async fillAndSubmitProfileForm(input:editPriofileActionInput) {
        let page = this.page;
        

        if (input.name && input.family)
            await page.fill("#pepName", input.name + " " + input.family);
        if (input.bio)
            await page.fill("#pepBio", input.bio);
        if (input.mail)
            await page.fill("#pepEmail", input.mail);
        if (input.phoneNumber)
            await page.fill("#pepEmail", input.phoneNumber.countryCode + ""+input.phoneNumber.phone);

        if(input.gender){
            await page.click('#pepGender');
            this.bot.delay('medium');
            if (input.gender?.toLowerCase() == 'male'){
                await page.click('[value="1"]', );
                await page.click("text='Done'");
            }
            else{
                await page.click('[value="2"]', );
                await page.click("text='Done'");
            }
        }
        this.bot.delay('low');

    }

    private async checkValidationForm() {
        var formErr = await this.page.$$("text= incorrect");
        if (formErr && formErr.length) {
            throw new Error('Please try again.');
        }
        
    }

    private async uploadAvatarIfExist(avatarPath:string | undefined) {
        const fs = require('fs');
        if (avatarPath && fs.existsSync(avatarPath)) {
            let handle = await this.page.$('input[type="file"]');
            if (handle) {
                await this.bot.delay('medium');
                await handle.setInputFiles(avatarPath);
                this.bot.delay('high');
                this.bot.delay('low');
            }
        }
        
    }
    private async submitForm() {
        let page = this.page;
        let submitBtn = await page.$("text='Submit'");
        if ( submitBtn && await submitBtn.isEnabled()){
            await submitBtn.click();
            await page.waitForLoadState('networkidle');
            await this.bot.delay("high");
        }
        await this.bot.delay("low");

    }

    
}