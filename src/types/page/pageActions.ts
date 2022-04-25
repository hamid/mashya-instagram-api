export interface PageInterface {

}

export interface LoadPageInputInterface{
    pageName    : string
}
export interface FollowActionInputInterface{
    pageName    : string
}


export interface GetInfoOutputInterface{
    fullName   : string | undefined;
    isPrivate: boolean | undefined;
    isInMyfollowing: boolean | undefined;
    postCount: string | undefined;
    followingCount: string | undefined;
    followerCount: string | undefined;
}