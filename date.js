

function myTime(){
  //newTime = date.now();
  return new Date().toLocaleTimeString();

    // var minute = date.getMinutes();
    // var hour = date.getHours();
    // return hour + ":" + minute;

}

function myDate(){
  return new Date().toLocaleDateString();

}

module.exports =  {myTime, myDate};


//module.exports = myDate;
