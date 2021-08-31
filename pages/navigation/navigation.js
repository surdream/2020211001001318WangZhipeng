var app = getApp();
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const qqmapsdk = new QQMapWX({
	key: '4JUBZ-3YMK6-PFRSG-E5RZQ-OTE52-62BHM' // 必填
});
Page({
  data: {
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    contentHeight: app.globalData.contentHeight,
    showPopup: false,
    active: 0,
    markers0: [
      {
        iconPath: "/images/navigation/cainiao.png",
        id: 0,
        address_name: '北区教-31栋',
        address_type: 'life',
        open_time: '06:00-22:00·周一到周日',
        latitude: 28.744614,
        longitude: 115.867065,
        width: 25,
        height: 25
      }
    ],
    markers1: [
      {
        iconPath: "/images/navigation/cainiao.png",
        id: 0,
        address_name: '北区超市',
        address_type: 'store',
        open_time: '07:00-22:00·周一到周日',
        latitude: 28.746858,
        longitude: 115.867778,
        width: 25,
        height: 25
      },
      {
        iconPath: "/images/navigation/cainiao.png",
        id: 1,
        address_name: '南区菜鸟驿站',
        address_type: 'express',
        open_time: '08:00-22:00·周一到周日',
        latitude: 28.744672,
        longitude: 115.869837,
        width: 25,
        height: 25
      },
      {
        iconPath: "/images/navigation/cainiao.png",
        id: 2,
        address_name: '北区教-31栋',
        address_type: 'life',
        open_time: '06:00-22:00·周一到周日',
        latitude: 28.744614,
        longitude: 115.867065,
        width: 25,
        height: 25
      }
    ],
    markers2: [
      {
        iconPath: "/images/navigation/cainiao.png",
        id: 0,
        address_name: '南区菜鸟驿站',
        address_type: 'express',
        open_time: '08:00-22:00·周一到周日',
        latitude: 28.744672,
        longitude: 115.869837,
        width: 25,
        height: 25
      }
    ]
  },
  onLoad: function (options) {
    let accountInfo = wx.getStorageSync('accountInfo');
    let markers0 = this.data.markers0;
    this.setData({
      accountInfo: accountInfo,
      markers: markers0
    })
  },
  onShow: function () {

  },
  bindmarkertap(e){
    let that = this;
    let markers0 = this.data.markers0; 
    let markers1 = this.data.markers1; 
    let markers2 = this.data.markers2; 
    let markers3 = this.data.markers3; 
    let active = this.data.active;
    let markerId = e.detail.markerId;
    if (active == 0) {
      var currMaker = markers0[markerId];
    } else if (active == 1) {
      var currMaker = markers1[markerId];
    } else if (active == 2) {
      var currMaker = markers2[markerId];
    } else if (active == 3) {
      var currMaker = markers3[markerId];
      console.log(currMaker);
    }
    console.log(markerId);
    console.log(currMaker);
    let end = String(currMaker.latitude + ',' + currMaker.longitude);
    console.log(end)
    wx.vibrateShort();//手机振动
    that.setData({
      currMaker:currMaker,
    })
    qqmapsdk.calculateDistance({
      //mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
      //from参数不填默认当前地址
      //获取表单提交的经纬度并设置from和to参数（示例为string格式）
      from: '', //若起点有数据则采用起点坐标，若为空默认当前地址
      to: end, //终点坐标
      success: function (res) {//成功后的回调
        console.log(res);
        var res = res.result;
        var dis = [];
        for (var i = 0; i < res.elements.length; i++) {
          dis.push(res.elements[i].distance); //将返回数据存入dis数组，
        }
        var takeTime=Number(dis * 0.015).toFixed(0);
       if(takeTime<60){
       }else{
         takeTime=Math.round(takeTime/60)  + "小时" + parseInt(takeTime % 60);
       }
        if(dis < 1000){
          var dis=dis+"米"
        }else if(dis > 1000){
          console.log()
          var dis=(Math.round(dis/100)/10).toFixed(1) + "公里"
      }
        that.setData({ //设置并更新distance数据
          distance: dis,
          takeTime: takeTime,
          showPopup: true
        })
      },fail: function(error) {
        console.error(error);
      },
    })
  },
  gomapiftion:function(e){
    let plugin = requirePlugin('routePlan');
    let key = '4JUBZ-3YMK6-PFRSG-E5RZQ-OTE52-62BHM';  //使用在腾讯位置服务申请的key
    let mode='walking';
    let referer = '一目校园';   //调用插件的app的名称
    let endPoint = JSON.stringify({  //终点
      'name': this.data.currMaker.address_name,
      'latitude': this.data.currMaker.latitude,
      'longitude': this.data.currMaker.longitude
    });
    wx.navigateTo({
        url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint +'&mode=' + mode
    });
    console.log(this.data.currMakerctname)
  },
  onChange(event) {
    let active = event.detail.name;
    let markers0 = this.data.markers0;
    let markers1 = this.data.markers1;
    let markers2 = this.data.markers2;
    let markers3 = this.data.markers3;
    if (active == 0) {
      this.setData({markers:markers0})
    } else if (active == 1) {
      this.setData({markers:markers1})
    } else if (active == 2) {
      this.setData({markers:markers2})
    } else if (active == 3) {
      this.setData({markers:markers3})
    }
    this.setData({
      active: active,
    })
  },
  popClose() {
    this.setData({ showPopup: false });
  },
  BackPage() {
    wx.navigateBack({
        delta: 1,
    }); 
  },
})