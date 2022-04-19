import { birthdate, gender, phoneNumber } from "./user"

export interface registerActionInput {
    name        : string
    family      : string
    birthdate   : birthdate
    uname       : string
    password    : string    
    gender      : gender | string
    registerByMail ?: boolean;
    mail        : string   
    phoneNumber : phoneNumber
    bio         ?: string
    avatarPath  ?: string
}
