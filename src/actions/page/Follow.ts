import type { BrowserContext, Page, ElementHandle } from 'playwright';
import { BaseSubActionClass, BaseActionInterface } from '../BaseActionClass';
import type { FollowActionInputInterface } from '../../types/page/pageActions';


export default class FollowAction extends BaseSubActionClass implements BaseActionInterface {
    public actionName: string = "Follow";
    protected input: FollowActionInputInterface;

    constructor(input: FollowActionInputInterface) {
        super(); // --> it's important
        this.input = input;
    }



    public async start() {
        try {
            let page        = this.page;
            let input       = this.input;

            this.setLog(`-follow: (${input.pageName})`, { percent: 50 });
            let followBtn    = await page.$("text='Follow'")
            if (followBtn){
                await followBtn.hover();
                await followBtn.click();
            }
            
            this.completeLog()
        } catch (e) {
            this.errorLog(e);
        }
    }



   

}