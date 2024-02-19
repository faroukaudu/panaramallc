//setup on digital ocean, Postfix
//https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-postfix-as-a-send-only-smtp-server-on-ubuntu-16-04


const nodemailer = require('nodemailer');

async function emailSent({sendTo:to, title:subject, message:msg, template:html, emailType:emailType}){
  console.log(to);
  console.log(subject);
  console.log(msg);
  const transporter = nodemailer.createTransport({
    host:"smtp.zoho.com",
    // host:"localhost",
    port: 465,
    secure: true,
  //   tls: {
  //   rejectUnauthorized: true,
  //   servername:"gmail.com"
  // },
    service: "zoho",
    
    auth: {
      user: "support@panaramallc.com",
      pass: "Hitsuppport@247"
    }
  });

  transporter.verify(function(error, success) {
   if (error) {
        console.log(error);
   } else {
        console.log('Server is ready');
   }
});

  const option = {
    from:"Support@panaramallc.com",
    // replyTo: 'noreply.admin@panaramallc',
    to: to,
    subject:subject,
    text:msg,
    //text:"Click this link to reset your password.."+ " " +"https://localhost:2000/pwdtoken/"+msg,
    // text:"Click this link to reset your password.."+ " " +"https://stingray-app-lgdmb.ondigitalocean.app/pwdtoken/",
    html:html 
  };

  const reset = {
    from:"Support@panaramallc.com",
    // replyTo: 'noreply.admin@panaramallc',
    to: to,
    subject:subject,
    text:msg,
    //text:"Click this link to reset your password.."+ " " +"https://localhost:2000/pwdtoken/"+msg,
    // text:"Click this link to reset your password.."+ " " +"https://stingray-app-lgdmb.ondigitalocean.app/pwdtoken/",
    // html:html 
  };

  if(emailType === "registration successful"){
    let info = transporter.sendMail(option, function(err, info){
      if(err){
        console.log(err);
      }else{
        console.log("send "+ info);
      }
      //console.log("send "+ info);c
    });
  }else if(emailType === "Password Reset"){
    let passReset = transporter.sendMail(reset, function(err, info){
      if(err){
        console.log(err);
      }else{
        console.log("send "+ info);
      }
      //console.log("send "+ info);c
    });
  }
}
//emailSent("fagzy99@gmail.com", "Online", "Check me wella");
 module.exports = {emailSent};
