
# Bot
Before run any command you should create and start a bot. each bot should manage one account. for building a bot and see available options
```typescript
//-1) Setup individual bot for a acoount
    var bot = new MashyaInstagramBot({

        botName: "myinsta",
        isDevelopment: true, //-** for PRODUCTION enviroments or non GUI os , you should set this options `false`

        logScreenshot:true,
        log:true,
        browser: "chromium",
        storagePath: './storage/', /*  it should be ended with:`/`     */
        slowMo:10,
        headless:false,
        chromiumSandbox: true,
        locale: 'en-US',
    });
```

## Options

### ***botName***
- **Required** | string
- Define the bot name.it also creates a browser session with this given name in storage folder, so it should be unique name for each account.

### ***isDevelopment***
- **Required** | boolean
- If you are in *production* mode you should set *`false`*, in development mode, for example, you could see the GUI of the browser in the other hand in production mode (like in Linux) the bot should run in headless mode (without GUI of the browser)
- All of the default values of below options depend on *isDevelopment* .


### ***logScreenshot***
-  Boolean | Default :  `true` [development] , `false`  [production]
-  if it's true, the bot will take screenshots of the browser in every step of each action and store them with meaningful names on *screenshot* folder.
-  for example in create post actions, the bot stores such these shots:
   -  log-amir.sedaporian-CreatePost  -1)goto Home Page.jpg
   -  log-amir.sedaporian-CreatePost  -2) Uploading image ... .jpg
   -  log-amir.sedaporian-CreatePost  -2)Set the caption.jpg
   -  ...
-  These screenshots will be taken just `before` the step start, for example the shot of *log-amir.sedaporian-CreatePost  -1)goto Home Page.jpg* was taken before going to home page.
-  They are very useful while `debugging` to find out why the bot or my account do not work properly.

### ***log***
-  Boolean | Default :  `true` [development,production]
-  if it's true, you could see progress-bars in the command line. the log shows actions with all steps. it also shows full error message.

### ***browser***
-  String | Default :  `chromium` [development,production]
-  Available values : `chromium`,`firefox`,`webkit`
-  it indicates the bot browser engine.firefox is very good but maybe lead to error in linux os.


### ***storagePath***
-  String | Default :  `./storage/` [development,production]
-  the boot need path to store some items, such browser cookie ,profile and etc, you could create directory and specify it
-  You must add  **`/`**  end of the path for example : `./mystorage/`


### ***slowMo***
-  Number | Default :   10 [development] , 300  [production]
-  it's speed of bot typing.
  
  
-----

After create successfully the bot, you could all run available commands. these commands divided into below master actions.
- [Account](docs/ACCOUNT.md)
  - to controll main action of account, like login,register,edit profile,review home post,review explore post and etc
- [Page](docks/PAGE.md)
  - any action to other accounts(or pages). like follow, message, get page info,get page last posts and etc
- [Post](docks/POST.md)
  - any action to individual post,these actions include: like, comment and etc.the post may belong to your account or any other pages account.

