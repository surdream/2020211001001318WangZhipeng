var app = getApp();
const { request } = require("../../utils/request/request");
let touchDotX = 0;
let touchDotY = 0;
let interval;
let time = 0;
Page({
  data: {
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    adaptValue: app.globalData.adaptValue,
    titleTarget: 0,
    hasMsg: true,
    chart_list: [
      {time: '08:00-09:40',name: '高等数学Ⅰ',background: '#74b9ff',status: 'now',remark: 'has'},
      {time: '10:30-12:10',name: '大学物理Ⅰ',background: '#55efc4',status: 'next'},
      {time: '14:30-16:10',name: '大学英语Ⅰ',background: '#ffeaa7',status: 'none',remark: 'has'}
    ],
    link_list: [
      {time: '10:30-12:10',name: '大学物理Ⅰ',background: '#55efc4',status: 'next'},
      {time: '14:30-16:10',name: '大学英语Ⅰ',background: '#ffeaa7',status: 'none',remark: 'has'}
    ],
    news_list: [
      {title: '第12届校花校草评选大赛开启帷幕了，有兴趣的过来看看吧~',from: '华东交通大学表白墙',time: '2021-7-28',count :'2364'},
      {title: '第13届校花校草评选大赛开启帷幕了，有兴趣的过来看看吧~',from: '华东交通大学表白墙',time: '2021-7-28',count :'6589'},
      {title: '第14届校花校草评选大赛开启帷幕了，有兴趣的过来看看吧~',from: '华东交通大学表白墙',time: '2021-7-28',count :'23'},
      {title: '第15届校花校草评选大赛开启帷幕了，有兴趣的过来看看吧~',from: '华东交通大学表白墙',time: '2021-7-28',count :'982'},
    ],
    imgUrls: [
      '/images/home/show.png',
      '/images/home/show.png',
      '/images/home/show.png'
    ],
    indicatorDots: false,
    autoplay: true,
    interval: 2400,
    duration: 800,
    swiperCurrent: 0,
  },
  onLoad: function (options) {
    request({
      url: "api/user/profile?", 
      method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
    }).then(res =>{
      console.log(res)
    })
  },
  onShow: function () {

  },
  infoListTap: function(e){
    let titleTarget = e.currentTarget.dataset.id;
    this.setData({
      titleTarget:titleTarget,
    })
    if(titleTarget == 2){
      this.setData({
        hasMsg: false
      })
    }
  },
  navTo(e){
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: '/pages/' + url + '/' + url,
    })
  },
  swiperChange(e) {
    let current = e.detail.current;
    let that = this;
    that.setData({
      swiperCurrent: current,
    })
  },
  touchStart: function (e) {
    // console.log(e)
    touchDotX = e.touches[0].pageX; // 获取触摸时的原点
    touchDotY = e.touches[0].pageY;
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
    this.setData({
      touchX: e.changedTouches[0].clientX,
      touchY: e.changedTouches[0].clientY,
    });
  },
  touchEnd: function (e) {
    // console.log(e)
    let touchMoveX = e.changedTouches[0].pageX;
    let touchMoveY = e.changedTouches[0].pageY;
    let tmX = touchMoveX - touchDotX;
    let tmY = touchMoveY - touchDotY;
    let {
      titleTarget
    } = this.data;
    if (time < 20) {
      let absX = Math.abs(tmX);
      let absY = Math.abs(tmY);
      if (absX > 2 * absY) {
        if (tmX < 0 && titleTarget == 0) {
          this.setData({
            titleTarget: 1,
          });
        } else if (tmX >= 0 && titleTarget == 1) {
          this.setData({
            titleTarget: 0,
          });
        } else if (tmX < 0 && titleTarget == 1) {
          this.setData({
            titleTarget: 2,
          });
        } else if (tmX >= 0 && titleTarget == 2) {
          this.setData({
            titleTarget: 1,
          });
        } else if (tmX < 0 && titleTarget == 2) {
          this.setData({
            titleTarget: 0,
          });
        } else if (tmX >= 0 && titleTarget == 0) {
          this.setData({
            titleTarget: 2,
          });
        } else {
          return;
        }
      }
    }
    clearInterval(interval);
    time = 0;
  },
})
