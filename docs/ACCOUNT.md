
# Account
This related to all action about acconting like:
  - [Register](#register)
  - [Login](#login)
  - [Edit profile](#editprofile)
  - [Review home post](#reviewhome)
  - [Add new post](#createpost)
  - Add new story


---
## Methods
As metion before, you should first create new bot and then call one of account method.




## ***login***
- Params: [object]
  - *uname*
  - *password*
- Goto instargam website and sign in via given uname and password.

```typescript
//-1) Setup Bot
   var bot = new MashyaInstagramBot({
        botName: "myinsta",
        isDevelopment: true,
        logScreenshot:true,
        log:true,
        storagePath:"./storage/"
    });
    await bot.start();

    //-2) Account Login
    await bot.account.login({
        uname: "username_or_mail_of_instagram",
        password: "password_of_account"
    });
```




## ***register***
- Sign up new account in instagram.
  
  **Warning**
   highly recomended to do not create too account with same ip or same bot name .instagram is very smart!.
- Params: [object]
  -  name        : string
  -  family      : string
  -  birthdate   : birthdate
  -  uname       : string
  -  password    : string    
  -  gender      : string  : "male" | "female"
  -  mail        : string   
  -  phoneNumber : phoneNumber

```typescript
//-1) Setup Bot
   var bot = new MashyaInstagramBot({
        botName: "myinsta",
        isDevelopment: true,
        logScreenshot:true,
        log:true,
        storagePath:"./storage/"
    });
    await bot.start();

    //-2) Account Login
    await bot.account.login({
        name        : "hamid",
        family      : "salimian",
        birthdate   : {  

        },
        uname       : "hamid_salimian",
        password    : "mystrongpassword",
        mail        : "insta@gmail.com"   
        gender      : "male",
        registerByMail : true;
        avatarPath  ?: string
    });
```


## ***editProfile***
- Goto instargam profile page and edit them
- Params: [object]
  -  uname: string,
  -  name : string,
  -  family:  string,
  -  gender :string,
  -  mail:  string,
  -  bio: string,
  -  avatarPath:  string,

```typescript
  //-1) Setup Bot
  // ...

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
```


## ***reviewHome***
- the bot scrolls down into home and review each posts.
- Params: [object]
  - postReviewCount  : [int] ,number of post that the bot mush review in home page
  - onPostReview   : [function]  ,this function will be call whenever the bot reaches to the post 
    - targetPost is kind of [post instance](docks/POST.md) and it has properties and methods related to post entity.

```typescript
  //-1) Setup Bot
  // ...

  //-- ReviewHome
  await bot.account.reviewHome({
      postReviewCount     : 10,
      onPostReview        : async (targetPost)=>
      {
        console.log('Post Review->', targetPost.caption , targetPost.caption);
        if(targetPost.owner == "some account"){
          await targetPost.like();
          await targetPost.comment("Hello... " + targetPost.owner);
        }
      }
    });
```

## ***createPost***
- Create image Post with caption and location
- Params: [object]
  - imagePath: [string] ,full path of image,
  - caption: [string],
  - location: [string]

```typescript
  //-1) Setup Bot

  //-2) Create Post
    await bot.account.createPost({
        imagePath: "./storage/post-pic222.jpg",
        caption: 'first post ...',
        location: "turkey"
    })
```
