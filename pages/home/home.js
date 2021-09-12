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
    bg_list: [
      {color: 'rgba(110,119,131,0.2)'},
      {color: 'rgba(66,211,173,0.2)'},
      {color: 'rgba(1,190,255,0.2)'},
      {color: 'rgba(1,190,255,0.2)'}
    ],
    news_list: [
      {title: '小程序简介',from: '一目校园',time: '2021-9-5',count: '0',url: 'https://mp.weixin.qq.com/s?__biz=MzkyMjI3Nzk4Nw==&mid=2247483865&idx=1&sn=e7713390823e057c27e1970470ee6714&chksm=c1f780d5f68009c3bfbe4de08c46093afb8e3b126ae2f0a543fa2165f10a2f1627034e4583ab&token=590067764&lang=zh_CN#rd'},
      {title: '新生攻略|交大入学指南',from: '一目校园',time: '2021-9-11',count: '0',url: 'https://mp.weixin.qq.com/s/q6iJiBK9_lSpu9beGF0BZw'},
      {title: '新生指南|军训宝典',from: '一目校园',time: '2021-9-12',count: '0',url: 'https://mp.weixin.qq.com/s/L2azadnVDq9r5LcldlRG6g'},
      {title: '新生指南|开学必备物品清单',from: '一目校园',time: '2021-9-13',count: '0',url: 'https://mp.weixin.qq.com/s/FK-8yq1Z3u4FduLvsivFKg'},
    ],
    imgUrls: [
      '/images/home/60.png',
      '/images/home/40.png',
      '/images/home/20.png'
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
      // 获取个人信息
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
          // 判断留言状态
          if(accountInfo.lover.msg.length != 0){
            this.setData({
              hasMsg: true
            })
          }
          // 判断情侣状态
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
          request({
            url: "api/user/login?" + "account=" + userInfo.account + "&password=" + userInfo.password, method: 'GET', 
          }).then(res => {
            wx.removeStorageSync('sessionid');
            wx.setStorageSync("sessionid", res.cookies[0]);
            // 获取个人信息
            request({
              url: "api/user/profile?", 
              method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
            }).then(res =>{
              let accountInfo = res.data.data;
              let lover_status = accountInfo.lover_status;
              wx.setStorageSync('accountInfo', accountInfo);
              this.setData({
                accountInfo: accountInfo,
                lover_status: lover_status
              })
              // 判断留言状态
              if(accountInfo.lover.msg.length != 0){
                this.setData({
                  hasMsg: true
                })
              }
              // 判断情侣状态
              if(lover_status == 2){
                this.setData({
                  popShow: true
                })
                wx.showToast({
                  title: '有一条绑定申请',
                  icon: 'none'
                })
                this.onLoad();
              }
            })
          })
        }
      })
      // 获取今日课表
      request({
        url: "api/edu/todayMain", 
        method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
      }).then(res =>{
        console.log(res.data.data)
        if (res.data.code == 200) {
          this.setData({
            chart_list: res.data.data.me,
            bind_list: res.data.data.lover
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
      wx.navigateTo({
        url: '../guide/guide?from=home',
      })
      wx.showToast({
        title: '绑定一位用户之后才能给对方留言哦',
        icon: 'none'
      })
    }
  },
  sorryTap(){
    wx.showToast({
      title: '该功能正在全力开发中，敬请期待',
      icon: 'none'
    })
  },
  navToMsg(){
    this.setData({ actionShow:false });
    wx.navigateTo({
      url: '/pages/couple/msgboard/msgboard',
    })
  },
  navToCouple(){
    wx.navigateTo({
      url: '/pages/couple/couple?from=home',
    })
  },
  navPublic(e){
    let url = e.currentTarget.dataset.url;
    console.log(url);
    wx.navigateTo({
      url: '../publicPage/publicPage?url=' + encodeURIComponent(JSON.stringify(url)),
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
