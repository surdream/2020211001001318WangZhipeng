import Notify from '@vant/weapp/notify/notify';
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
    contentHeight: app.globalData.contentHeight,
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
      {title: '第16届校花校草评选大赛开启帷幕了，有兴趣的过来看看吧~',from: '华东交通大学表白墙',time: '2021-7-28',count :'982'},
    ],
    imgUrls: [
      '/images/home/show.png',
      '/images/home/show.png',
      '/images/home/show.png'
    ],
    msgValue: '',
    hasMsg: false,
    popShow: false,
    actionShow: false,
    indicatorDots: false,
    autoplay: true,
    interval: 2400,
    duration: 800,
    titleTarget: 0,
    swiperCurrent: 0,
  },
  onLoad: function (options) {
    let firstUse = wx.getStorageSync('firstUse');
    if(firstUse == 'not'){
      request({
        url: "api/user/profile?", 
        method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
      }).then(res =>{
        if(res.data.code == 200){
          console.log(res.data.data);
          let accountInfo = res.data.data;
          let lover_status = accountInfo.lover_status;
          wx.setStorageSync('accountInfo', accountInfo);
          this.setData({
            accountInfo: accountInfo,
            lover_status: lover_status
          })
          if(accountInfo.lover.msg.length != 0){
            this.setData({
              hasMsg: true
            })
          }
          if(lover_status == 2){
            this.setData({
              popShow: true
            })
            wx.showToast({
              title: '有一条绑定申请',
              icon: 'none'
            })
            this.onLoad()
          }
        } else if(res.data.code == 400){
          wx.showToast({
            title: '系统正在维护',
            icon: 'error'
          })
        }
      })
    }
  },
  onShow: function () {

  },
  navTo(e){
    let firstUse = wx.getStorageSync('firstUse');
    if(firstUse == 'not'){
      let url = e.currentTarget.dataset.url;
      wx.navigateTo({
        url: '/pages/' + url + '/' + url,
      })
    } else{
      wx.navigateTo({
        url: '../guide/guide?from=import',
      })
    }
  },
  popBtnTap(e){
    let type = e.currentTarget.dataset.type;
    console.log(type);
    request({
      url: "api/lover/" + type, 
      method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
    }).then(res =>{
      console.log(res)
      this.setData({ popShow: false });
    })
  },
  popLinkTap(){
    wx.showToast({
      title: '抱歉，个人主页暂未开放',
      icon: 'none'
    })
  },
  writeTap(){
    let lover_status = this.data.lover_status;
    if(lover_status == 1){
      this.setData({ actionShow: true })
    } else{
      wx.showToast({
        title: '你还没有绑定情侣',
        icon: 'none'
      })
    }
  },
  navToMsg(){
    wx.navigateTo({
      url: '/pages/couple/msgboard/msgboard',
    })
  },
  swiperChange(e) {
    let current = e.detail.current;
    let that = this;
    that.setData({
      swiperCurrent: current,
    })
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
  showPopup() {
    this.setData({ popShow: true });
  },
  onClose() {
    this.setData({ popShow: false });
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
    if(msgValue.length == 0){
      wx.showToast({
        title: '请输入想说的话',
        icon: 'error'
      })
    } else{
      request({
        url: "api/lover/sendmsg?content=" + msgValue, 
        method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
      }).then(res =>{
        console.log(res);
        if(res.data.code == 200){
          wx.showToast({
            title: '留言发送成功！对方将在留言板看到你的留言',
            icon: 'none'
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
    }
  },
  touchStart: function(e){
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
  touchEnd: function(e){
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
  pullUpLoad: function(){
    var that = this;
    console.log("====下拉====");
    let arr = that.data.news_list;
    let newArr = arr.concat(arr);
    console.log(newArr);
    this.setData({
      news_list: newArr
    })
    Notify({
      message: '获取到 5 条动态',
      type: 'success ',
      safeAreaInsetTop: true,
      duration: '600'
    });
  }
})
