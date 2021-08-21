var app = getApp();
const { request } = require("../../utils/request/request");
var time = require('../../utils/util.js');
Page({
  data: {
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    windowHeight: app.globalData.windowHeight,
    msgValue: '',
    pageTitle: '情侣空间',
    hasLoveDate: false,
    selectedDay: '请选择',
    courentDay: '',
    dayDiff: '?',
  },
  onLoad: function (options) {
    let accountInfo = wx.getStorageSync('accountInfo');
    let loverInfo = wx.getStorageSync('accountInfo').lover;
    this.setData({
      accountInfo: accountInfo,
      loverInfo: loverInfo
    })
  },
  onShow: function () {
    var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
    let courentDay = time.formatTimeRev(timestamp,'Y/M/D');
    this.setData({
      courentDay: courentDay
    })
  },
  navTo(e){
    let url = e.currentTarget.dataset.url;
    if(url == 'loverTarget'||url == 'loverActivity'){
      wx.showToast({
        title: '功能正在开发，敬请期待',
        icon: 'none'
      })
    } else{
      wx.navigateTo({
        url: '/pages/couple/' + url + '/' + url,
      })
    }
  },
  datePickerSelected(e){
    let selectedDay = e.detail.value.replace(/-/g,'/')
    let courentDay = this.data.courentDay;
    let dayDiff = ((Date.parse(courentDay))-(Date.parse(selectedDay)))/86400000;
    this.setData({
      selectedDay: selectedDay,
      dayDiff: dayDiff
    })
  },
  unbind(){
    request({
      url: "api/user/unbindLover", 
      method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
    }).then(res =>{
      console.log(res)
    })
  },
  changeContent(){
    let dayDiff = this.data.dayDiff;
    if(dayDiff == '?'){
      wx.showToast({
        title: '请选择相恋日期',
        icon: 'error'
      })
    } else{
      this.setData({ 
        hasLoveDate: true,
        pageTitle: '情侣空间'
      })
    }
  },
  writeTap(){
    wx.navigateTo({
      url: './msgboard/msgboard',
    })
  },
  heartTap(){
    wx.showToast({
      title: 'enjoy~🥰',
      icon: 'none'
    })
  },
  BackPage() {
    wx.navigateBack({
        delta: 1,
    }); 
  },
})