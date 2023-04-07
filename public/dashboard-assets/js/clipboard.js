//Geting coin address////////////////////
let copyText = document.querySelector("div.wallet-box-main input");
let coin = copyText.getAttribute("value");
//alert(coin);
// coin.select();
// document.execCommand("copy");
// alert(coin);
// navigator.clipboard.writeText(coin);
// navigator.clipboard.writeText(coin).then(function(){
//   alert("copied");
// }, function(err){
//   alert("eror");
// })


const copyContent = async () => {

   try {
     await navigator.clipboard.writeText(coin);
     document.querySelector(".paying").classList.toggle("visible");
     alert('Content copied to clipboard');
   } catch (err) {
     alert(err);
   }
 }
//
//

 document.querySelector(".wallet-box").addEventListener(

   // window.getSelection().removeAllRanges();
   // setTimeOut(function(){
   //   copyText.querySelector("wallet-box")classList.remove("wallet-box-pop");
   // },3000)
   "click", function(){
       // copyText.querySelector("button.wallet-box")classList.toggle("visible");
      copyContent();

   }
 )






















// let copyText = document.querySelector(".wallet-box");
// copyText.querySelector("button").addEventListener(
//   "click", function(){
//
//     let input = copyText.querySelector("input.html");
//     alert(copyText.html);
//     input.select();
//     document.execCommand("copy");
//     copyText.classList.add("active");
//     window.getSelection().removeAllRanges();
//     // setTimeOut(function(){
//     //   copyText.classList.remove("active");
//     // }, 2500);
//
//
//   }
// );
