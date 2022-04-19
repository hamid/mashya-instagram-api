import type { BrowserContext, Page }                from 'playwright';
import { BaseSubActionClass, BaseActionInterface }  from '../BaseActionClass';
import type { postActionInputType }                    from '../../types/post/postAction';


export default class LikeAction extends BaseSubActionClass implements BaseActionInterface
{
    public actionName   : string = "LikePost";
    protected input: postActionInputType;

    constructor(input: postActionInputType){
        super(); // --> it's important
        this.input = input;
    }

    

    public async start(){
        try {
            let bot         = this.bot;
            let browser     = this.browser;
            let page        = this.page;
            let input       = this.input;
            let postElement = this.input.element;
            if(!postElement)
                throw new Error("element as input of post.like() method is not set.");
            await postElement.dblclick();

            this.completeLog()
        } catch (e) {
            this.errorLog(e);
        }
    }
    
}