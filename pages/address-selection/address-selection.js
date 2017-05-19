
const province = ["河北省","山东省","辽宁省","黑龙江省","吉林省","甘肃省","青海省","河南省","江苏省","湖北省","湖南省","江西省","浙江省","广东省","云南省","福建省","台湾省","海南省","山西省","四川省","陕西省","贵州省","安徽省","重庆市","北京市","上海市","天津市","广西壮族自治区","内蒙古自治区","西藏自治区","新疆维吾尔自治区","宁夏回族自治区","澳门特别行政区","香港特别行政区"]
const city = ["a","b","c","d","e","g","h"]
const area = ["j","k","l","i","y","t","g"]

Page({
	data: {
   // years: years,
    province:province,
    //months: months,
    city: city,
  //  days: days,
    area: area,
    value: [0, 0, 0]
  },
  bindChange: function(e) {
    const val = e.detail.value
    console.log(e.detail.value)
    /*this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]]
    })*/
  },
})

