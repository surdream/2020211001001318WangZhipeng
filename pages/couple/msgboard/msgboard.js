var app = getApp();
const { request } = require("../../../utils/request/request");
Page({
  data: {
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    contentHeight: app.globalData.contentHeight,
    msgValue: '',
  },
  onLoad: function (options) {
    request({
      url: "api/lover/msgAll", 
      method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
    }).then(res =>{
      console.log(res);
      let lover_msg = res.data.lover
    })
    let accountInfo = wx.getStorageSync('accountInfo');
    let user_id = accountInfo.userid;
    let user_img = accountInfo.avatar;
    let loverInfo = accountInfo.lover;
    let lover_img = loverInfo.avatar;
    let lover_id = loverInfo.lover_id;
    this.setData({
      accountInfo: accountInfo,
      loverInfo: loverInfo,
      user_id: user_id,
      lover_id: lover_id,
      user_img: user_img,
      lover_img: lover_img,
    })
  },
  onShow: function () {
  },
  onChange(e){
    let value = e.detail;
    this.setData({
      msgValue: value
    })
  },
  sentTap(){
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
            title: '留言发送成功！',
          })
          request({
            url: "api/user/profile?", 
            method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
          }).then(res =>{
            if(res.data.code == 200){
              let accountInfo = res.data.data;
              let loverInfo = accountInfo.lover;
              console.log(loverInfo.msg)
              this.setData({
                accountInfo: accountInfo,
                user_id: accountInfo.userid,
                user_img: accountInfo.avatar,
                loverInfo: accountInfo.lover,
                lover_id: loverInfo.lover_id,
                lover_img: loverInfo.avatar,
              })
              wx.setStorageSync('accountInfo', accountInfo);
            }
          })
          this.setData({
            msgValue: '',
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
  BackPage() {
    wx.navigateBack({
        delta: 1,
    }); 
  },
})