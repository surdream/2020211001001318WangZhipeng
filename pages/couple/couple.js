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
    hasLoveDate: true,
    selectedDay: '请选择',
    courentDay: '',
    dayDiff: '?',
    alter: false
  },
  onLoad: function (options) {
    let from = options.from;
    this.setData({ from: from })
    request({
      url: "api/user/profile?", 
      method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
    }).then(res =>{
      if(res.data.code == 200){
        console.log(res.data.data);
        let accountInfo = res.data.data;
        let loverInfo = accountInfo.lover;
        wx.setStorageSync('accountInfo', accountInfo);
        this.setData({
          accountInfo: accountInfo,
          loverInfo: loverInfo
        })
        if(loverInfo.lover_date != null){
          request({
            url: "api/lover/dayAll", 
            method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
          }).then(res =>{
            console.log(res)
            let dayArr = res.data.data;
            this.setData({
              dayArr: dayArr
            })
            request({
              url: "api/lover/msgAll", 
              method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
            }).then(res =>{
              console.log(res);
              let lover_msg = res.data.data;
              this.setData({
                lover_msg_length: lover_msg.length
              })
            })
          })
        } else{
          this.setData({
            hasLoveDate: false,
            pageTitle: '相恋日'
          })
        }
      } else if(res.data.code == 400){
        wx.showToast({
          title: '系统正在维护',
          icon: 'error'
        })
      }
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
      // request({
      //   url: "api/lover/unbindLover", 
      //   method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
      // }).then(res =>{
      //   console.log(res)
      // })
    } else{
      wx.navigateTo({
        url: './' + url + '/' + url,
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
      url: "api/lover/unbindLover", 
      method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
    }).then(res =>{
      console.log(res)
    })
  },
  changeContent(){
    let alter = this.data.alter;
    let dayDiff = this.data.dayDiff;
    let selectedDay = this.data.selectedDay;
    if (alter) {
      if (dayDiff == '?') {
        this.setData({
          hasLoveDate: true,
        })
        wx.showToast({
          title: '未更改',
          icon: 'none'
        })
      } else{
        request({
          url: "api/lover/setLoverDay?date=" + selectedDay, 
          method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
        }).then(res =>{
          console.log(res);
          let code = res.data.code;
          if(code == 200){
            this.onLoad()
            wx.showToast({
              title: '设置相恋日成功',
            })
            this.setData({ 
              hasLoveDate: true,
              pageTitle: '情侣空间'
            })
          } else if(code == 205){
            wx.showToast({
              title: 'error~请重试',
              icon: 'error'
            })
          } else if(code == 400){
            wx.showToast({
              title: '登录状态失效，请重新打开本程序',
              icon: 'none'
            })
          }
        })
      }
    } else {
      if(dayDiff == '?'){
        wx.showToast({
          title: '请选择相恋日期',
          icon: 'error'
        })
      } else{
        request({
          url: "api/lover/setLoverDay?date=" + selectedDay, 
          method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
        }).then(res =>{
          console.log(res);
          let code = res.data.code;
          if(code == 200){
            this.onLoad()
            wx.showToast({
              title: '设置相恋日成功',
            })
            this.setData({ 
              hasLoveDate: true,
              pageTitle: '情侣空间'
            })
          } else if(code == 205){
            wx.showToast({
              title: 'error~请重试',
              icon: 'error'
            })
          } else if(code == 400){
            wx.showToast({
              title: '登录状态失效，请重新打开本程序',
              icon: 'none'
            })
          }
        })
      }
    }

  },
  changeDate(){
    this.setData({
      alter: true,
      hasLoveDate: false,
      pageTitle: '修改相恋日'
    })
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
  BackCouple(){
    this.setData({
      alter: false,
      pageTitle: '情侣空间',
      hasLoveDate: true
    })
  },
  BackHome(){
    wx.navigateBack({
      delta: 1,
    });
  },
  BackPage() {
    wx.switchTab({
      url: '../mine/mine',
    })
  },
})