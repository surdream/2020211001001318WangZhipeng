var app = getApp(); 
Page({
  data: {
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    currMaker:{}
  },
  BackPage(){
    wx.navigateBack({
      delta: 1,
    })
  },
  onLoad: function (options) {
    let currMaker = JSON.parse(options.data)
    console.log(currMaker);
    this.setData({
      currMaker:currMaker
    })
  },
  onShow: function () {

  }
})