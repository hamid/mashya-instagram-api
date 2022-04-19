import type { BrowserContext, Page }                from 'playwright';
import { BaseSubActionClass, BaseActionInterface }  from '../BaseActionClass';
import type { postActionInputType }                    from '../../types/post/postAction';


export default class CommentAction extends BaseSubActionClass implements BaseActionInterface
{
    public actionName   : string = "CommentPost";
    protected input: postActionInputType;

    constructor(input: postActionInputType){
        super(); // --> it's important
        this.input = input;
    }

    

    public async start(commentText:string){
        try {
            let bot         = this.bot;
            let browser     = this.browser;
            let page        = this.page;
            let input       = this.input;
            let postElement = this.input.element;
            if(!postElement)
                throw new Error("element as input of post.Comment() method is not set.");
            
            let commentTextInput = await postElement?.locator('textarea');
            if (commentTextInput && await commentTextInput.count())
            {
                this.setLog("-)Typeing : "+commentText, { percent: 50 });
                await commentTextInput.first().type(commentText);
                await this.bot.delay("low");
                this.setLog("-)Posting the comment ", { percent: 75 });
                await postElement?.locator('text="Post"').first().click();
                await this.bot.delay("low");
            }
            
            this.completeLog()
        } catch (e) {
            this.errorLog(e);
        }
    }
    
}