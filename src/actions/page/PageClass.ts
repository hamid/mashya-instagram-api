import type { BrowserContext, Page } from 'playwright';
import {BaseActionClass}             from '../BaseActionClass';

import LoadPageAction                from './LoadPage';
import FollowAction                  from './Follow';
import type { PageInterface }        from "../../types/page/pageActions"

export default class InstaPage extends BaseActionClass{

    public name             : string  | undefined;
    public fullName         : string  | undefined;
    public isLoaded         : boolean = false;
    public isPrivate        : boolean | undefined;
    public isInMyfollowing  : boolean | undefined;
    public postCount        : string  | undefined;
    public followingCount   : string  | undefined;
    public followerCount    : string  | undefined;

    constructor(){
        super();
    }

    public async loadPage(pageName : string){
        let bot     = this.bot;
        let browser = this.browser;
        let page    = this.page;
        let LoadPageActionObj = new LoadPageAction({pageName})
        LoadPageActionObj.setup(bot, browser, page);
        await LoadPageActionObj.start();

        if (LoadPageActionObj.isLoadSuccessfully()){
            let pageInfo        = await LoadPageActionObj.getInfo();
            this.isLoaded       = true;
            this.fullName       = pageInfo.fullName;
            this.isPrivate      = pageInfo.isPrivate;
            this.isInMyfollowing= pageInfo.isInMyfollowing;
            this.postCount      = pageInfo.postCount;
            this.followerCount  = pageInfo.followerCount;
            this.followingCount = pageInfo.followingCount;
        }

        return this;
    }

    public async Follow(pageName : string){
        let bot     = this.bot;
        let browser = this.browser;
        let page    = this.page;

        if(this.isLoaded == false)
            await this.loadPage(pageName);

        let FollowActionObj = new FollowAction({pageName})
        FollowActionObj.setup(bot, browser, page);
        await FollowActionObj.start();

        return this;
    }




    
}
export type InstaPageInterface = typeof InstaPage;