# mashya-instagram-api
<p align="center">
<a href="#examples"><img width="322" align="center" alt=" github.com/hamid  mashya instagram api" src="https://user-images.githubusercontent.com/1645233/165082744-c247ad88-a223-4ff1-96af-b0d1fbfd12f2.png"></a>
  </p>

 NodeJS Instagram API.it's like bot that simulate main instagram action, login, register, post, story, like, follow, ...
 this package uses [Playwright](https://playwright.dev/docs/library) under the hood for simulation.this instgram bot consists of these below method:
 - Account
   - register
   - login
   - edit profile
   - review home post
   - add new post
   - add new story
 - Page
   - follow
   - get page info
 - Post
   - like
   - comment
   
   

*( and to be developing ...)*


# Table of Contents
- [Examples](#examples)
- [Install](#install)
- [Documents](#Docs)
- [debug](#examples)
- [Contribution](#contribution)



# Examples

_Note for JavaScript users:_
As of Node v.13.5.0, there isn't support for ESModules and the 'import'-syntax.
So you have to read the imports in the examples like this:

`import { A } from 'b'` ➡ `const { A } = require('b')`

```typescript
import MashyaInstagramBot from 'mashya-instagram-api';


(async () => {

    //-1) Setup individual bot for a acoount
    var bot = new MashyaInstagramBot({
        botName: "myinsta",
        isDevelopment: true,
        logScreenshot:true,  //-** for PRODUCTION enviroments or non GUI os , you should set this options `true`
        log:true,
    });
    await bot.start()
    
    //-2) Login acoount into created bot
    await bot.account.login({
        uname       : "username",
        password    : "pass"
    });

    //-3) and now your bot at your services sir!
    

    //-- Review Home post
     await bot.account.reviewHome({
         postReviewCount     : 10,
         onPostReview        : async (targetPost)=>{
             // console.log('Post Review ...', targetPost);
             await targetPost.comment("Hello... " + targetPost.owner);
         }
     });
     
    //-- load  and follow page
    await bot.page.Follow("meta");


    //-- Comment & like
     let targetPost = await bot.post.loadPostByUrl("https://www.instagram.com/p/CVTtCZotdJX/");
     await targetPost.like();
     await targetPost.comment("Hi friend...");


})();

```

# Install
Playwright requires Node.js version **12** or above
### Mac and Windows
Requires 10.14 (Mojave) or above.
1) First you should install [Playwright](https://playwright.dev/docs/library)
```sh
npm i -D playwright
```
2) and then install the bot from npm

```
npm install instagram-private-api
```

### Install and run in Linux
##### using Docker
We offer using a official [Playwright Docker image](https://hub.docker.com/_/microsoft-playwright)
```sh
docker pull mcr.microsoft.com/playwright
```
and in your *Dockerfile* 
```Containerfile
FROM mcr.microsoft.com/playwright:bionic
...
npm install instagram-private-api
```
##### or Install dependencies
If you don't want use Docker, depending on your Linux distribution, you might need to install additional dependencies to run the bots.see [playwright install](https://playwright.dev/docs/library#linux)
```sh
npx playwright install --with-deps chromium
npm install instagram-private-api
```



# Docs
Before run any command you should create and start a bot. each bot should manage one account. for building a bot and see available options see [Bot docs](docs)
```typescript
//-1) Setup individual bot for a acoount
    var bot = new MashyaInstagramBot({
        botName: "myinsta",
        isDevelopment: true, //-** for PRODUCTION enviroments or non GUI os , you should set this options `true`
        logScreenshot:true, 
        log:true,
        //.. see other options in bot docs page
    });
```

After create successfully the bot, you could all run available commands. these commands divided into below master actions.
- [Account](docs/account)
  - to controll main action of account, like login,register,edit profile,review home post,review explore post and etc
- [Page](docks/page)
  - any action to other accounts(or pages). like follow, message, get page info,get page last posts and etc
- [Post](docks/post)
  - any action to individual post,these actions include: like, comment and etc.the post may belong to your account or any other pages account.




