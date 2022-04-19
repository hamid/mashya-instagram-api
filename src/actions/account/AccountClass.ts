import type { BrowserContext, Page } from 'playwright';
import {BaseActionClass}             from '../BaseActionClass';

import LoginAction                   from './login';
import type { loginActionInput }     from '../../types/loginAction';
import type { registerActionInput }     from '../../types/registerAction';
import type { editPriofileActionInput  }     from '../../types/editProfileAction';
import type { reviewHomeActionInput  }     from '../../types/reviewHomeAction';
import RegisterAction from './register';
import EditProfileAction from './editProfile';
import ReviewHome from './reviewHome';

export default class Account extends BaseActionClass{

    constructor(){
        super();
    }

    public async login(input:loginActionInput){

        let bot     = this.bot;
        let browser = this.browser;
        let page    = this.page;
        let login   = new LoginAction(input);
        login.setup(bot,browser,page);
        await login.start();
        return this;
    }
    
    public async register(input: registerActionInput){

        let bot         = this.bot;
        let browser     = this.browser;
        let page        = this.page;
        let register    = new RegisterAction(input)
        register.setup(bot,browser,page);
        await register.start();
        return this;
    }
    
    public async editProfile(input: editPriofileActionInput){

        let bot         = this.bot;
        let browser     = this.browser;
        let page        = this.page;
        let editProfile = new EditProfileAction(input)
        editProfile.setup(bot,browser,page);
        await editProfile.start();
        return this;
    }
    
    public async reviewHome(input: reviewHomeActionInput){

        let bot         = this.bot;
        let browser     = this.browser;
        let page        = this.page;
        let reviewHome  = new ReviewHome(input)
        reviewHome.setup(bot,browser,page);
        await reviewHome.start();
        return this;
    }



    
}
export type AccountInterface = typeof Account;