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
    actionShow: false,
    selectedDay: '请选择',
    courentDay: '',
    dayDiff: '?',
  },
  onLoad: function (options) {
    let accountInfo = wx.getStorageSync('accountInfo');
    let loverInfo = wx.getStorageSync('accountInfo').lover;
    console.log(loverInfo)
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
    wx.navigateTo({
      url: '/pages/couple/' + url + '/' + url,
    })
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
    this.setData({ actionShow: true })
  },
  onChange(e){
    let value = e.detail;
    this.setData({
      msgValue: value
    })
  },
  actionClose() {
    this.setData({ actionShow: false });
  },
  sentMsg(){
    let msgValue = this.data.msgValue;
    request({
      url: "api/user/sendmsg?content=" + msgValue, 
      method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
    }).then(res =>{
      console.log(res);
      if(res.data.code == 200){
        wx.showToast({
          title: '留言发送成功！',
        })
        this.setData({
          actionShow: false,
          msgValue: ''
        })
      } else if(res.data.code == 400){
        wx.showToast({
          title: '发送失败请重试',
          icon: 'error'
        })
      }
    })
  },
  BackPage() {
    wx.navigateBack({
        delta: 1,
    }); 
  },
})