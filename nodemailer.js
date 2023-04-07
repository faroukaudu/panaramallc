//setup on digital ocean, Postfix
//https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-postfix-as-a-send-only-smtp-server-on-ubuntu-16-04


const nodemailer = require('nodemailer');

async function emailSent(to, subject, msg){
  console.log(to);
  console.log(subject);
  console.log(msg);
  const transporter = nodemailer.createTransport({
    host:"localhost",
    tls: {
    rejectUnauthorized: false
  },
    service: "Hotmail",
    port: 25,
    auth: {
      user: "otps-verify@outlook.com",
      pass: "12345!@Abcde"
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
    from:"otps-verify@outlook.com",
    to: to,
    subject:subject,
    text:"Click this link to reset your password.."+ " " +"http://localhost:3000/pwdtoken/"+msg,

  };

  let info = await transporter.sendMail(option, function(err, info){
    if(err){
      console.log(err);
    }else{
      console.log("send "+ info);
    }
    //console.log("send "+ info);c
  });
}
//emailSent("fagzy99@gmail.com", "Online", "Check me wella");
 module.exports = {emailSent};
