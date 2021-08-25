var app = getApp();
var time = require('../../../utils/util.js');
const { request } = require("../../../utils/request/request");
Page({
  data: {
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    dayTitle: '',
    type: 'add',
    pageTitle: '添加纪念日',
    selectedDay: '点击选择日期',
    titleInput: true
  },
  onLoad: function (options) {
    let type = options.type;
    let dayTitle = options.title;
    let selectedDay = options.time;
    let dayid = options.dayid;
    console.log(options)
    if(type == 'add'){
      this.setData({
        dayTitle: dayTitle
      })
    } else if(type == 'alter'){
      this.setData({
        type: 'alter',
        pageTitle: '修改纪念日',
        selectedDay: selectedDay,
        dayTitle: dayTitle,
        dayid: dayid,
        titleInput: false
    })
    }
  },
  onShow: function () {
    var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
    let courentDay = time.formatTimeRev(timestamp,'Y/M/D');
    this.setData({
      courentDay: courentDay
    })
  },
  datePickerSelected(e){
    let selectedDay = e.detail.value.replace(/-/g,'/')
    this.setData({
      selectedDay: selectedDay
    })
  },
  detailInput: function(e){
    let {
    } = this.data;
    let name = e.currentTarget.dataset.name;
    let value = e.detail.value;
    this.setData({
      [name]: value,
      haveResult: false
    });
  },
  subTap(){
    let dayTitle = this.data.dayTitle;
    let selectedDay = this.data.selectedDay;
    if(selectedDay != '点击选择日期' && dayTitle != ''){
      request({
        url: "api/lover/createday?content=" + dayTitle + "&date=" + selectedDay, 
        method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
      }).then(res =>{
        console.log(res)
        if(res.data.code == 200){
          wx.navigateTo({
            url: '../anniversary/anniversary',
          })
          wx.showToast({
            title: '添加成功',
          })
        } else if(res.data.code == 205){
          wx.showToast({
            title: '无法添加纪念日',
            icon: 'error'
          })
        } else if(res.data.code == 400){
          wx.showToast({
            title: '登录失效请重试',
            icon: 'error'
          })
        }
      })
    } else{
      wx.showToast({
        title: '填写信息不完整',
        icon: 'error'
      })
    }
  },
  delTap(){
    let dayid = this.data.dayid;
    let dayTitle = this.data.dayTitle;
    let selectedDay = this.data.selectedDay;
    wx.showModal({
      title: '提示',
      content: '确认要删除 ' + this.data.dayTitle + ' 吗',
      success (res) {
        if (res.confirm) {
          if(selectedDay != '点击选择日期' && dayTitle != ''){
            request({
              url: "api/lover/deleteday?dayid=" + dayid, 
              method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
            }).then(res =>{
              console.log(res)
              console.log(111)
              if(res.data.code == 200){
                wx.navigateTo({
                  url: '../anniversary/anniversary',
                })
                wx.showToast({
                  title: '删除成功',
                })
              } else if(res.data.code == 206){
                wx.showToast({
                  title: '无法删除对方设置的纪念日',
                  icon: 'none'
                })
              } else if(res.data.code == 205){
                wx.showToast({
                  title: '无法删除纪念日',
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

        }
        }
      }
    })
  },
  BackPage() {
    wx.navigateBack({
        delta: 1,
    }); 
  },
})