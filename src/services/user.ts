const fs    = require('fs');


let User = {

    saveUserCookie: async (uname:string, content:string) => {
        return fs.writeFileSync('./storage/userStorage/' + uname + ".txt", content);
    },

    loadUserCookie: async (uname:string) => {
        var path = './storage/userStorage/' + uname + ".txt";
        if (fs.existsSync(path)) {
            return fs.readFileSync(path, 'utf8');
        }
        return false;
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