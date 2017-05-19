var myconst = require('./common')

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function string2date(str){
  let temp = new Date (str),
  today = new Date()
  if(today -temp > 0) {
    return '已过期'
  }else{
    let hasdate = (temp - today)/86400000
    return '还有'+Math.round(hasdate)+'天过期'
  }
}


function expire(str){
  let temp = new Date (str),
  today = new Date()
  if(today -temp > 0) {
    return true
  }else{
    let hasdate = (temp - today)/86400000
    return false
  }
  return true
}
function getType (tp) {
    let x = ""
    switch(tp){
      case myconst.GOODS:
        x = "抵用券"
        break;
      case myconst.SWIM:
        x = "游泳券"
        break;
      case myconst.DELIVERY:
        x = "配送券"
        break;
      case myconst.REGISTER:
        x = "注册送游泳券"
        break;
     }
     return x;
}
function num2percent (a,b) {
  a = parseInt(a)
  b = parseInt(b)
  return (b-a)/b * 100 
}
module.exports = {
  formatTime: formatTime,
  string2date:string2date,
  isExpire:expire,
  getType:getType,
  num2percent:num2percent
}
