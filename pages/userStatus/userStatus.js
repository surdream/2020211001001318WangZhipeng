var app = getApp();
Page({
  data: {
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    contentHeight: app.globalData.contentHeight,
    colorList: app.globalData.glassColor,
    moodStatus: [
      {name: '开心',url: '../../images/status/mood/laugh.png'},
      {name: '保持微笑',url: '../../images/status/mood/smile.png'},
      {name: '要亲亲',url: '../../images/status/mood/kiss.png'},
      {name: '呆住',url: '../../images/status/mood/freeze.png'},
      {name: '太难了',url: '../../images/status/mood/upset.png'},
      {name: '尴尬',url: '../../images/status/mood/awkward.png'},
      {name: '邪恶',url: '../../images/status/mood/evil.png'},
      {name: '可爱',url: '../../images/status/mood/cute.png'},
      {name: '很生气',url: '../../images/status/mood/angry.png'},
    ],
    workStatus: [
      {name: '工作',url: '../../images/status/work/sun.png'},
      {name: '勿扰',url: '../../images/status/work/moon.png'},
      {name: '论文',url: '../../images/status/work/word.png'},
      {name: '实验',url: '../../images/status/work/lab.png'},
      {name: '比赛',url: '../../images/status/work/match.png'},
      {name: '代码',url: '../../images/status/work/laptop.png'},
      {name: '测量',url: '../../images/status/work/measure.png'},
      {name: '金工',url: '../../images/status/work/weld.png'},
      {name: '绘画',url: '../../images/status/work/draw.png'},
      {name: '阅读',url: '../../images/status/work/book.png'},
      {name: '讨论',url: '../../images/status/work/chat.png'},
      {name: '摄影',url: '../../images/status/work/shot.png'},
    ],
    lifeStatus: [
      {name: '听歌',url: '../../images/status/life/earphone.png'},
      {name: '睡一天',url: '../../images/status/life/sleep.png'},
      {name: '等快递',url: '../../images/status/life/express.png'},
      {name: '奶茶',url: '../../images/status/life/milktea.png'},
      {name: '火锅',url: '../../images/status/life/hotpot.png'},
      {name: '炸鸡',url: '../../images/status/life/chick.png'},
      {name: '王者荣耀',url: '../../images/status/life/sword.png'},
      {name: '绝地求生',url: '../../images/status/life/pubg.png'},
      {name: '主机玩家',url: '../../images/status/life/gamer.png'},
    ],
  },
  onLoad: function (options) {

  },
  onShow: function () {

  },
  statusType: function(e){
    let mood = this.data.moodStatus[e.currentTarget.dataset.mood];
    let work = this.data.workStatus[e.currentTarget.dataset.work];
    let life = this.data.lifeStatus[e.currentTarget.dataset.life];
    let type = e.currentTarget.dataset.type;
    console.log(mood);
    console.log(work);
    console.log(life);
    console.log(type)
    switch(type){
      case 'mood': wx.setStorageSync('status', mood);break;
      case 'work': wx.setStorageSync('status', work);break;
      case 'life': wx.setStorageSync('status', life);break;
    }
    wx.showToast({
      title: '状态设置成功！',
    })
    this.BackPage()
  },
  BackPage() {
    wx.navigateTo({
      url: '/pages/index/index',
    })
    // wx.navigateBack({
    //     delta: 1,
    // });
  },
})