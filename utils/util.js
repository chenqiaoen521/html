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
    let x = {}
    switch(tp){
      case myconst.GOODS:
        x.type="抵用券";
        x.color="#ffca13";
        break;
      case myconst.SWIM:
        x.type="游泳券";
        x.color="#25e2fe";
        break;
      case myconst.DELIVERY:
        x.type="配送券";
        x.color="#ffca13";
        break;
      case myconst.REGISTER:
        x.type="注册送游泳券";
        x.color="#ffca13";
        break;
      case 4:
        x.type="(赠送)游泳券";
        x.color="#780cfd";
        break;
      case 5:
        x.type="(积分兑换)游泳券";
        x.color="#0cdefd";
        break;
      case 6:
        x.type="(团购)游泳券";
        x.color="#ffca13";
        break;
     }
     console.log(x)
     return x;
}
function toDate(time){
  var s =time
  s = s.replace(/-/g,"/")
  var d = new Date(s)
  return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()
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
  num2percent:num2percent,
  toDate:toDate
}
