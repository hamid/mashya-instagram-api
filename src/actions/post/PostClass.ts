import type { BrowserContext, Page, ElementHandle, Locator } from 'playwright';
import {BaseActionClass}             from '../BaseActionClass';

import LikeAction                   from './Like';
import CommentAction                from './Comment';


export default class Post extends BaseActionClass{

    public link             : string| null = null;
    public owner            : string| null = null;
    public mediaLink        : string| null = null;
    public caption          : string| null = null;
    public element          : Locator|null = null;
    public isInPostUrl      : boolean | null = null;

    constructor(){
        super();
    }

    public async loadPostByElement(element: Locator){
        this.element     = element;
        this.isInPostUrl = false;
    }

    public async loadPostByUrl(url:string){
    }

    public async gotoPostUrl(){
        //- first way : click on comment icon
        if(this.isInPostUrl)
            return;

        let commentBtn = await this.element?.locator('[aria-label="Comment"]')
        if (commentBtn && await commentBtn.count() && await commentBtn.nth(1)) {
            let parentBtn = await commentBtn.nth(1);
            // let parent    =  await parentBtn.$('xpath=..');
            await parentBtn.click();
            this.element = await this.page.locator('[role="dialog"]').first();
            await this.bot.delay("high");
        }
        //- secend way : go directly to post link
        //...
    }

    public async like(){
        let bot             = this.bot;
        let browser         = this.browser;
        let page            = this.page;
        let likeActionObj   = new LikeAction({
            element     : this.element
        })
        likeActionObj.setup(bot,browser,page);
        await likeActionObj.start();
        return this;
    }


    public async comment(commentText:string){
        let bot             = this.bot;
        let browser         = this.browser;
        let page            = this.page;
        if (this.isInPostUrl){
            var beforeCommentPgaeState = "isInPostUrl";
        }else{
            var beforeCommentPgaeState = "isNotInPostUrl";
            await this.gotoPostUrl();
        }
        
        let commentActionObj = new CommentAction({
            element: this.element
        });
        commentActionObj.setup(bot,browser,page);
        await commentActionObj.start(commentText);

        // back to state of before comment
        if (beforeCommentPgaeState == "isNotInPostUrl"){
            await page.keyboard.press('Escape');
            await page.goBack();
        }
            
        return this;
    }
    
    



    
}
export type PostInterface = typeof Post;