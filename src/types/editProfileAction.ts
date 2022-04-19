import {  gender, phoneNumber } from "./user"

export interface editPriofileActionInput {
    uname        : string
    name        ?: string
    family      ?: string
    gender      ?: gender | string
    mail        ?: string   
    phoneNumber ?: phoneNumber
    bio         ?: string
    avatarPath  ?: string
    
}
