var app = getApp();
const { request } = require("../../../utils/request/request");
Page({
  data: {
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    type: 'add',
    nextList: [
      {
        icon: '/images/anniversary/cake.png',
        title: '距离Ta的生日',
        time: '2022/1/15',
        count: '11'
      },
      {
        icon: '/images/anniversary/couple.png',
        title: '距离相恋日',
        time: '2021/11/7',
        count: '85'
      },
    ],
    dayList: [
      {
        icon: '/images/anniversary/rumour.png',
        title: '第一次暧昧',
        time: '2021/11/1',
        count: '79'
      },
      {
        icon: '/images/anniversary/game.png',
        title: '第一次开黑',
        time: '',
        count: ''
      },
      {
        icon: '/images/anniversary/date.png',
        title: '第一次约会',
        time: '',
        count: ''
      },
      {
        icon: '/images/anniversary/food.png',
        title: '第一次共进晚餐',
        time: '',
        count: ''
      },
      {
        icon: '/images/anniversary/music.png',
        title: '第一次听歌',
        time: '',
        count: ''
      },
      {
        icon: '/images/anniversary/movie.png',
        title: '第一次看电影',
        time: '',
        count: ''
      },
      {
        icon: '/images/anniversary/gift.png',
        title: '第一次送礼物',
        time: '',
        count: ''
      },
      {
        icon: '/images/anniversary/cloth.png',
        title: '第一次穿情侣装',
        time: '',
        count: ''
      },
      {
        icon: '/images/anniversary/gift.png',
        title: '第一次同乘出行',
        time: '',
        count: ''
      },
      {
        icon: '/images/anniversary/ktv.png',
        title: '第一次双人K歌',
        time: '',
        count: ''
      },
      {
        icon: '/images/anniversary/hotel.png',
        title: '第一次同住酒店',
        time: '',
        count: ''
      },
      {
        icon: '/images/anniversary/travel.png',
        title: '第一次双人旅行',
        time: '',
        count: ''
      },
      {
        icon: '/images/anniversary/pet.png',
        title: '第一次共养宠物',
        time: '',
        count: ''
      },
      {
        icon: '/images/anniversary/sex.png',
        title: '第一次爱爱',
        time: '',
        count: ''
      },
    ]
  },
  onLoad: function (options) {
    request({
      url: "api/lover/dayAll", 
      method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
    }).then(res =>{
      console.log(res)
      let dayArr = res.data.data;
      this.setData({
        dayArr: dayArr
      })
    })
  },
  onShow: function () {
    let accountInfo = wx.getStorageSync('accountInfo');
    let loverInfo = wx.getStorageSync('accountInfo').lover;
    this.setData({
      accountInfo: accountInfo,
      loverInfo: loverInfo
    })
  },
  listTap(e){
    let type = e.currentTarget.dataset.type;
    let time = e.currentTarget.dataset.time;
    let title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: '../addDay/addDay?type=' + type + '&title=' + title + '&time=' + time,
    })
  },
  addTap(){
    wx.navigateTo({
      url: '../addDay/addDay',
    })
  },
  alterStatus(){
    let type = this.data.type;
    if(type == 'add'){
      this.setData({ type: 'alter'})
      wx.showToast({
        title: '编辑纪念日',
        icon: 'none'
      })
    } else if(type == 'alter'){
      this.setData({ type: 'add'})
    }
  },
  BackPage() {
    wx.navigateBack({
        delta: 1,
    }); 
  },

})