import type { BrowserContext, Page, ElementHandle, Locator } from 'playwright';
import { BaseSubActionClass, BaseActionInterface }  from '../BaseActionClass';
import User                                         from '../../services/user';
import type { reviewHomeActionInput }                    from '../../types/reviewHomeAction';
import colors from 'ansi-colors';

import Post from '../post/PostClass';


export default class ReviewHome extends BaseSubActionClass implements BaseActionInterface
{
    public actionName   : string = "ReviewHome";
    protected input     : reviewHomeActionInput;

    constructor(input: reviewHomeActionInput){
        super(); // --> it's important
        this.input = input;
    }
    

    public async start(){
        try {
            let postCount   = this.input.postReviewCount ?? 10;
            
            this.setLog("1)goto Home Page", { percent: 5 });
            await this.gotoHome();

            this.setLog("2)Review Home Post", { percent: 10 });
            await this.postsLoop(   async(targetPost,index)=>
            {
                let currentPrecent = 10 + ((90 / postCount)*(index+1));
                this.setLog(`-)Get ${index + 1}th post of ${postCount}`, { percent: currentPrecent });
                if (this.input.onPostReview)
                    await this.input.onPostReview(targetPost,index);
            });
            




            this.completeLog()

        } catch (e) {
            this.errorLog(e);
        }
    }


    public async gotoHome(){
        var homeElm = await this.page.$$("[href='/']");
        if (homeElm && homeElm.length){
            await homeElm[0].click();
            await this.page.waitForLoadState('networkidle');
        }else
            await this.page.goto("https://www.instagram.com/");
        this.bot.delay('medium');
    }


    public async postsLoop( postCallback: (PostObj: Post,index:number )=>{}   ){
        let page            = this.page;
        let postCount       = this.input.postReviewCount ?? 10;
        let bot             = this.bot;

        var list = await Post.findAllPostsElementFromHome(page);
        if (list && list.length)
            for (let i = 0; i < postCount; i++)
            {
                // -- if > 3 then stay at 3 because new post push to end and old post remove from first so stay at index 3
                var index = i > 3 ? 3 : i;

                // if post is exist
                if (list[index]) {
                    // scroll to post 
                    // -- space in instagram does scrolling to next post
                    await page.keyboard.press('Space');
                    await bot.delay("low");

                    if (postCallback){
                        var postElm      : Locator      = await Post.findPostLocatorFromHome(page).nth(index);
                        var currentPost                 = await this._buildHomePost(postElm,index);
                        if(currentPost.link)
                            await postCallback(currentPost, i);
                    }
                    await bot.delay("low");
                    // refresh list    
                    list = await Post.findAllPostsElementFromHome(page);
                }
            }
    }


    private async _buildHomePost(postElm: Locator, index: number):Promise<Post>{

        await this._clickOnMoreCaption(postElm, index);

        var postLink            = await this._getPostLink(index)
        var postPageOwner       = await this._getPostOwner(index);
        var postCaption         = await this._getPostCaption(index);
        var postImgVideo        = await this._getPostImgOrVideo(index);

        let currentPost         = new Post();
        currentPost.setup(this.bot, this.browser, this.page);
        currentPost.link        = postLink;
        currentPost.owner       = postPageOwner;
        currentPost.mediaLink   = postImgVideo;
        currentPost.caption     = postCaption;
        if (postElm)
            currentPost.loadPostByElement(postElm);

        return currentPost;
    }


    private async _getPostLink(postIndex:number){
        return this.page.evaluate((i) => { // @ts-ignore: Unreachable code error
            if (document.querySelectorAll('._8Rm4L ')[i] && document.querySelectorAll('._8Rm4L ')[i].querySelector('a[href^="/p/"]')) { return document.querySelectorAll('._8Rm4L ')[i].querySelector('a[href^="/p/"]').href }
        }, postIndex);
    }
    private async _getPostOwner(postIndex:number){
        return await this.page.evaluate((i) => { // @ts-ignore: Unreachable code error
            if (document.querySelectorAll('._8Rm4L')[i].querySelector('header a.sqdOP')) { return document.querySelectorAll('._8Rm4L')[i].querySelector('header a.sqdOP').text }
        }, postIndex);
    }
    private async _getPostCaption(postIndex:number){
        return await this.page.evaluate((i) => {
            // @ts-ignore: Unreachable code error
            var elm = document.querySelectorAll('._8Rm4L')[i];
            // @ts-ignore: Unreachable code error
            var textelm = elm.querySelector('._8Pl3R') || elm.querySelector('[data-testid="post-comment-root"]')
            // @ts-ignore: Unreachable code error
            if (textelm) {
                // @ts-ignore: Unreachable code error
                var text = textelm.innerText;
                if (text == '... more' || text == '.... more' || text == '..... more') {
                    // @ts-ignore: Unreachable code error
                    elm.querySelector('.sXUSN').click();
                    // @ts-ignore: Unreachable code error
                    text = textelm.innerText;
                }
                return text
            }
        }, postIndex);
    }
    private async _getPostImgOrVideo(postIndex:number){
        return await this.page.evaluate((i) => {
            // @ts-ignore: Unreachable code error
            if (document.querySelectorAll('._8Rm4L')[i] && document.querySelectorAll('._8Rm4L')[i].querySelector('img.FFVAD'))
            // @ts-ignore
                return document.querySelectorAll('._8Rm4L')[i].querySelector('img.FFVAD').src
            // @ts-ignore
            else if (document.querySelectorAll('._8Rm4L')[i] && document.querySelectorAll('._8Rm4L')[i].querySelector('video'))
            // @ts-ignore
                return document.querySelectorAll('._8Rm4L')[i].querySelector('video').poster;
        }, postIndex);
    }

    private async _clickOnMoreCaption(postElm:Locator,index:number){
        if (postElm ) {
            var moreElm = await postElm.locator('.sXUSN');
            if (moreElm && await moreElm.count() ) {
                await moreElm.first().click();
                this.bot.delay("low")
            }
        }
    }

    
}