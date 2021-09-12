var app = getApp();
Page({
  data: {
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    contentHeight: app.globalData.contentHeight,
    developer: '< 荣誉Developer >',
    designer: '< 荣誉Designer >',
    developer_list: [
      {
        name: '屁屁威',
        url: 'https://v.powerv.top/static/img/avatar/zzw.jpg',
        job: '开发&设计'
      },
      {
        name: '子楠',
        url: 'https://v.powerv.top/static/img/avatar/lzn.jpg',
        job: '产品&运营'
      },
      {
        name: '青灯夜游',
        url: 'https://v.powerv.top/static/img/avatar/zyd.jpg',
        job: '开发&运营'
      },
      {
        name: '浩浩子',
        url: 'https://v.powerv.top/static/img/avatar/hh.jpg',
        job: '开发'
      },
      {
        name: '枭丰',
        url: 'https://v.powerv.top/static/img/avatar/rxf.jpg',
        job: '开发'
      },
      {
        name: 'B612',
        url: 'https://v.powerv.top/static/img/avatar/wzl.jpg',
        job: '开发'
      },
      {
        name: '凉城',
        url: 'https://v.powerv.top/static/img/avatar/ljt.jpg',
        job: '开发'
      },
      {
        name: '俊成',
        url: 'https://v.powerv.top/static/img/avatar/ljc.jpg',
        job: '开发&运营'
      },
    ],
    designer_list: [
      {
        name: '墨鱼',
        url: 'https://v.powerv.top/static/img/avatar/czy.jpg',
        job: '设计&运营'
      },
      {
        name: '依然',
        url: 'https://v.powerv.top/static/img/avatar/yyr.jpg',
        job: '设计&运营'
      }
    ]
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  BackPage() {
    wx.navigateBack({
        delta: 1,
    }); 
  },
})