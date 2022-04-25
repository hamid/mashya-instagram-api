import type { BrowserContext, Page, ElementHandle } from 'playwright';
import { BaseSubActionClass, BaseActionInterface } from '../BaseActionClass';
import type { LoadPageInputInterface, GetInfoOutputInterface } from '../../types/page/pageActions';


export default class LoadPageAction extends BaseSubActionClass implements BaseActionInterface {
    public actionName: string = "LoadPage";
    public loadSuccessfully: boolean | undefined;
    protected input: LoadPageInputInterface;

    constructor(input: LoadPageInputInterface) {
        super(); // --> it's important
        this.input = input;
    }



    public async start() {
        try {
            let input = this.input;
            let searchElement = await this._getSeacrhElement();

            if (searchElement){
                this.setLog(`1-type page name (${input.pageName}) in search box `, { percent: 25 });
                await this.searchAndGotoPage(searchElement,input.pageName);

            } else {
                this.setLog(`1-goto page (${input.pageName}) `, { percent: 25 });
                await this._directlyGotoPage(input.pageName);
            }
            this.loadSuccessfully = true;

            this.completeLog()
        } catch (e) {
            this.errorLog(e);
        }
    }

    public isLoadSuccessfully(): boolean {
        if (this.loadSuccessfully)
            return true;
        else
            return false
    }


    public async getInfo(): Promise<GetInfoOutputInterface>{
        let page = this.page;
        var output : GetInfoOutputInterface = {
            fullName:undefined,
            isPrivate : undefined,
            isInMyfollowing : undefined,
            postCount : undefined,
            followerCount: undefined,
            followingCount : undefined
        };
        // let fullnameElm = await page.$$('.QGPIr');
        let fullnameElm = await page.locator(':light(.QGPIr .T0kll)')
        if (fullnameElm && fullnameElm.first())
            output.fullName = await fullnameElm.first().textContent() ?? undefined;
        
        let isPrivateElm = await page.$("text=Account is Private")
        if(isPrivateElm)
            output.isPrivate = true;
        else
            output.isPrivate = false;

        let isInMyfollowingElm = await page.$("text='Follow'")
        if (isInMyfollowingElm)
            output.isInMyfollowing = false;
        else
            output.isInMyfollowing = true;

        let activityConter = await page.$$(".k9GMp .g47SY")
        if (activityConter && activityConter.length){
            output.postCount        = await activityConter[0].innerText();
            output.followerCount    = await activityConter[1].innerText();
            output.followingCount   = await activityConter[2].innerText();
        }
        return output;
    }


    private async _getSeacrhElement() {
        let page = this.page;
        var searchElm = await page.$$('[aria-label="Search Input"]');
        if (searchElm && searchElm.length) {
            return searchElm[0];
        }
        return false;
    }

    private async searchAndGotoPage(searchElement: ElementHandle,pageName:string){
        let page = this.page;
        let bot  = this.bot;
        await searchElement.type(pageName);
        await bot.delay("medium");
        let searchResults = await page.$$('[role = "none"]');
        if (searchResults && searchResults[0])
            await searchResults[0].click();
        else{
            let isNoResultState = await page.$("text=No results")
            if (isNoResultState)
                throw new Error("No result found for: "+pageName);
        }
    }


    private async _directlyGotoPage(pageName:string)
    {
        await this.page.goto(`https://www.instagram.com/${pageName}/`);
        await this.page.waitForLoadState('networkidle');

        let isNoResultState = await this.page.$("text=page isn't available.")
        if (isNoResultState)
            throw new Error("No result found for:" + pageName);

    }


   

}