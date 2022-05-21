const fs    = require('fs');


let User = {

    storagePath: './storage/' ,

    saveUserCookie: async (uname:string, content:string) => {
        return fs.writeFileSync(User.storagePath + uname + ".txt", content);
    },

    loadUserCookie: async (uname:string) => {
        var path = User.storagePath + uname + ".txt";
        if (fs.existsSync(path)) {
            return fs.readFileSync(path, 'utf8');
        }
        return false;
    },

    setStoragePath: (path:string|undefined)=>{
        if(path)
            User.storagePath = path;
    },



    makeRandomStr: (length:number) => {
        var result:string = '';
        var characters:string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnpqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },



}
export default User;