import type { BrowserContext, Page } from 'playwright';
import {BaseActionClass}             from '../BaseActionClass';

import LoginAction                   from './login';
import type { loginActionInput }     from '../../types/loginAction';

export default class Account extends BaseActionClass{

    constructor(){
        super();
    }

    public async login(input:loginActionInput){

        let bot     = this.bot;
        let browser = this.browser;
        let page    = this.page;
        let login   = new LoginAction(input);
        login.setBrowser(bot,browser,page);
        await login.start();
        return this;
    }



    
}
export type AccountInterface = typeof Account;