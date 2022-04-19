
import Post from '../actions/post/PostClass'

export interface reviewHomeActionInput {
    postReviewCount          ?: number
    onPostReview?(currentPost : Post,index:number):void
    
}
