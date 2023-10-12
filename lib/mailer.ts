const nodemailer = require("nodemailer")

let mailTransporter = nodemailer.createTransport({
    service: "gmail",
    
})