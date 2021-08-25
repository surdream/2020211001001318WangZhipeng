var app = getApp();
const { request } = require("../../../utils/request/request");
Page({
  data: {
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    type: 'add',
    dayList: [
      {
        icon: '/images/anniversary/rumour.png',
        title: '第一次暧昧',
        time: '',
        count: '',
        dayid: ''
      },
      {
        icon: '/images/anniversary/game.png',
        title: '第一次开黑',
        time: '',
        count: '',
        dayid: ''
      },
      {
        icon: '/images/anniversary/date.png',
        title: '第一次约会',
        time: '',
        count: '',
        dayid: ''
      },
      {
        icon: '/images/anniversary/food.png',
        title: '第一次共进晚餐',
        time: '',
        count: '',
        dayid: ''
      },
      {
        icon: '/images/anniversary/music.png',
        title: '第一次听歌',
        time: '',
        count: '',
        dayid: ''
      },
      {
        icon: '/images/anniversary/movie.png',
        title: '第一次看电影',
        time: '',
        count: '',
        dayid: ''
      },
      {
        icon: '/images/anniversary/gift.png',
        title: '第一次送礼物',
        time: '',
        count: '',
        dayid: ''
      },
      {
        icon: '/images/anniversary/cloth.png',
        title: '第一次穿情侣装',
        time: '',
        count: '',
        dayid: ''
      },
      {
        icon: '/images/anniversary/gift.png',
        title: '第一次同乘出行',
        time: '',
        count: '',
        dayid: ''
      },
      {
        icon: '/images/anniversary/ktv.png',
        title: '第一次双人K歌',
        time: '',
        count: '',
        dayid: ''
      },
      {
        icon: '/images/anniversary/hotel.png',
        title: '第一次同住酒店',
        time: '',
        count: '',
        dayid: ''
      },
      {
        icon: '/images/anniversary/travel.png',
        title: '第一次双人旅行',
        time: '',
        count: '',
        dayid: ''
      },
      {
        icon: '/images/anniversary/pet.png',
        title: '第一次共养宠物',
        time: '',
        count: '',
        dayid: ''
      },
      {
        icon: '/images/anniversary/sex.png',
        title: '第一次爱爱',
        time: '',
        count: '',
        dayid: ''
      },
    ]
  },
  onLoad: function (options) {
    let accountInfo = wx.getStorageSync('accountInfo');
    let loverInfo = wx.getStorageSync('accountInfo').lover;
    this.setData({
      accountInfo: accountInfo,
      loverInfo: loverInfo
    })
  },
  onShow: function () {
    request({
      url: "api/lover/dayAll", 
      method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
    }).then(res =>{
      console.log(res)
      let dayArr = res.data.data;
      this.setData({
        dayArr: dayArr
      })
      let dayList = this.data.dayList;
      for(let i=0;i<dayList.length;i++){
        let title = dayList[i].title;
        for(let j=0;j<dayArr.length;j++){
          let content = dayArr[j].content;
          if (title == content) {
            let count_str =  'dayList[' + i +'].count';
            let time_str =  'dayList[' + i +'].time';
            let dayid_str =  'dayList[' + i +'].dayid';
            this.setData({
              [count_str]: dayArr[j].gap,
              [time_str]: dayArr[j].date,
              [dayid_str]: dayArr[j].dayid,
            })
            let indexs = dayArr.indexOf(dayArr[j]);
            let newArr =  dayArr.remove(indexs);
            console.log(newArr)
          }
        }
      }
    })
  },
  listTap(e){
    let type = e.currentTarget.dataset.type;
    let time = e.currentTarget.dataset.time;
    let title = e.currentTarget.dataset.title;
    let dayid = e.currentTarget.dataset.dayid;
    wx.navigateTo({
      url: '../addDay/addDay?type=' + type + '&title=' + title + '&time=' + time + '&dayid=' + dayid,
    })
  },
  addTap(){
    wx.navigateTo({
      url: '../addDay/addDay?type=new',
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
    wx.navigateTo({
      url: '../couple',
    })
  },
})