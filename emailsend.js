const sendingMails = require('./nodemailer.js');
const handlebars = require("handlebars");
const fs = require('fs');


function emailTemplate({username:name, email:email}){
    const source = fs.readFileSync('email_template.html', 'utf-8').toString();
    const template = handlebars.compile(source);
    const replacements = {
        username: name
    };

    const htmlToSend = template(replacements);

    try {
        sendingMails.emailSent({sendTo:email, title:"Panarama Registration Successful",
    message:"Welcome to Panarama LLC,", template:htmlToSend, emailType:"registration successful"});
    } catch (err) {
        res.send(err);
    }
}

// var live = "http://localhost:2000";
var live = "https://enzymesmillionaireclub.com";

function resetPassword({email:userEmail, userID:id,}){
    try {sendingMails.emailSent({sendTo:userEmail, title:"Password Reset",
     message:"Kindly Click the link below to reset your password | "+live+"/panaramall/22"+id+"rectify"
     ,template:"none",emailType:"Password Reset"});
    } catch (err){
        res.send(err);
    }
}



// module.exports = {emailTemplate};

module.exports = {
    registrationMail:emailTemplate,
    passwordResetMail:resetPassword,
  }