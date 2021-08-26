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
      let lover_msg = res.data.data;
      this.setData({
        lover_msg: lover_msg,
        toView: 'item' + (lover_msg.length - 1)
      })
    })
    let accountInfo = wx.getStorageSync('accountInfo');
    let loverInfo = accountInfo.lover;
    this.setData({
      accountInfo: accountInfo,
      loverInfo: loverInfo,
      user_id: accountInfo.userid,
      lover_id: loverInfo.lover_id,
      user_img: accountInfo.avatar,
      lover_img: loverInfo.avatar,
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
  msgDelete(e){
    let that = this;
    let msgid = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '真的要删除这条留言吗（无法撤回）',
      success (res) {
        if (res.confirm) {
          request({
            url: "api/lover/deletemsg?msgid=" + msgid, 
            method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
          }).then(res =>{
            console.log(res)
            if(res.data.code == 200){
              request({
                url: "api/lover/msgAll", 
                method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
              }).then(res =>{
                console.log(res);
                let lover_msg = res.data.data;
                console.log(that.data.lover_id)
                that.setData({
                  lover_msg: lover_msg
                })
                wx.showToast({
                  title: '删除成功！',
                })
              })

            } else if(res.data.code == 206){
              wx.showToast({
                title: '只能删除自己的留言哦',
                icon: 'none'
              })
            } else if(res.data.code == 205){
              wx.showToast({
                title: '不能删除该留言',
                icon: 'error'
              })
            } else if(res.data.code == 400){
              wx.showToast({
                title: '登录失效请重试',
                icon: 'error'
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
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
            url: "api/lover/msgAll", 
            method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
          }).then(res =>{
            console.log(res);
            let lover_msg = res.data.data;
            this.setData({
              lover_msg: lover_msg,
              msgValue: '',
            })
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