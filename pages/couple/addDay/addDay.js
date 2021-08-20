var app = getApp();
var time = require('../../../utils/util.js');
Page({
  data: {
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    dayTitle: '',
    type: 'add',
    pageTitle: '添加纪念日',
    selectedDay: '点击这里选择日期',
  },
  onLoad: function (options) {
    let type = options.type;
    let dayTitle = options.title;
    let selectedDay = options.time;
    console.log(options)
    if(type == 'alter'){
      this.setData({
        type: 'alter',
        pageTitle: '修改纪念日',
        selectedDay: selectedDay
      })
    }
    var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
    let courentDay = time.formatTimeRev(timestamp,'Y/M/D');
    this.setData({
      dayTitle: dayTitle,
      courentDay: courentDay
    })
  },
  onShow: function () {

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
    wx.navigateBack({
      delta: 1,
    }); 
    wx.showToast({
      title: '添加成功',
    })
  },
  delTap(){
    wx.showModal({
      title: '提示',
      content: '确认要删除 ' + this.data.dayTitle + ' 吗',
      success (res) {
        if (res.confirm) {
          wx.navigateBack({
            delta: 1,
          }); 
          wx.showToast({
            title: '删除成功',
          })
        } else if (res.cancel) {

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