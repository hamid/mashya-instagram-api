import MashyaInstagramBot from '../src/bot';


  

(async () => {
    
    var bot = new MashyaInstagramBot({
        botName: "myinsta",
        isDevelopment: true,
        logScreenshot:true,
        log:true,
    });
    await bot.start()
    await bot.account.login({
        uname       : "uname",
        password    : "pass"
    });

    //-- load and follow page
    await bot.page.Follow("ted");

    //-- ReviewHome
    await bot.account.reviewHome({
        postReviewCount     : 10,
        onPostReview        : async (targetPost)=>{
            // console.log('Post Review ...', targetPost.caption);
            await targetPost.comment("Hello... " + targetPost.owner);
        }
    });


    //-- Comment
    let targetPost = await bot.post.loadPostByUrl("https://www.instagram.com/p/CVTtCZotdJX/");
    await targetPost.like();
    await targetPost.comment("Hi i'm Mashya...");


    //-- EditProfile
    await bot.account.editProfile({
        uname: "uname",
        name : "name",
        family:"family",
        gender:"male",
        mail:"mail@gmail.com",
        bio:"the user bio...",
        avatarPath:"./storage/profile-pic2.jpg",
    })






})();