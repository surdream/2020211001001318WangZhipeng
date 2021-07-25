var app = getApp();
let touchDotX = 0;
let touchDotY = 0;
let interval;
let time = 0;
Page({
  data: {
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    contentHeight: app.globalData.contentHeight,
    titleTarget: 0,
    myInfo: [{name: '屁屁威',major:'软件工程',url: '/images/conmon/boy.png'}],
    infoFromBox: [
      {name: '王志良',url: '../../images/inbox/wang.jpg',count: '26'},
      {name: '卢江涛',url: '../../images/inbox/lu.jpg',count: '9'},
      {name: '王志良',url: '../../images/inbox/wang.jpg',count: '99+'},
      {name: '卢江涛',url: '../../images/inbox/lu.jpg',count: '78'},
      {name: '王志良',url: '../../images/inbox/wang.jpg',count: '99+'},
      {name: '卢江涛',url: '../../images/inbox/lu.jpg',count: '78'},
    ],
    infoListTitle: [
      {name: '教务通知'},{name: '留言私信'},{name: '关注动态'}
    ],
    officeList: [
      {title: '华东交通大学教务处',detail: '你的《计算机组成原理》出分了，快来看看吧你的《计算机组成原理》出分了，快来看看吧',time: '今天 08:00',url: '/images/conmon/ecjtu.jpg',status: 0},
      {title: '华东交通大学教务处',detail: '你的《计算机网络》出分了，快来看看吧你的《计算机组成原理》出分了，快来看看吧',time: '今天 08:00',url: '/images/conmon/ecjtu.jpg',status: 0},
      {title: '华东交通大学教务处',detail: '你的《数据结构》出分了，快来看看吧你的《计算机组成原理》出分了，快来看看吧',time: '今天 08:00',url: '/images/conmon/ecjtu.jpg',status: 1},
      {title: '华东交通大学教务处',detail: '你的《数据结构》出分了，快来看看吧',time: '今天 08:00',url: '/images/conmon/ecjtu.jpg',status: 1},
      {title: '华东交通大学教务处',detail: '你的《数据结构》出分了，快来看看吧你的《计算机组成原理》出分了，快来看看吧',time: '今天 08:00',url: '/images/conmon/ecjtu.jpg',status: 0},
    ],
    msgList: [],
    subList: [],
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
  infoListTap: function(e){
    let titleTarget = e.currentTarget.dataset.id;
    this.setData({
      titleTarget:titleTarget,
      fromTarget: null,
    })
  },
  fromTap: function(e){
    let fromTarget = e.currentTarget.dataset.id;
    this.setData({
      fromTarget: fromTarget,
      titleTarget: 2
    })
  },
  clearBtn: function(){
    let that = this;
    wx.showModal({
      title: '清除',
      content: '是否清除历史通知',
      success (res) {
        if (res.confirm) {
          that.setData({
            officeList: []
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  navToOffice: function(){
    wx.showModal({
      title: '跳转',
      content: '是否前往教务查看',
      success (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/office/office',
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  touchStart: function (e) {
    // console.log(e)
    touchDotX = e.touches[0].pageX; // 获取触摸时的原点
    touchDotY = e.touches[0].pageY;
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
    this.setData({
      touchX: e.changedTouches[0].clientX,
      touchY: e.changedTouches[0].clientY,
    });
  },
  touchEnd: function (e) {
    // console.log(e)
    let touchMoveX = e.changedTouches[0].pageX;
    let touchMoveY = e.changedTouches[0].pageY;
    let tmX = touchMoveX - touchDotX;
    let tmY = touchMoveY - touchDotY;
    let {
      titleTarget
    } = this.data;
    if (time < 20) {
      let absX = Math.abs(tmX);
      let absY = Math.abs(tmY);
      if (absX > 2 * absY) {
        if (tmX < 0) {
          // console.log("左滑=====" + tmX)
        } else {
          // console.log("右滑=====" + tmX)
        }
        if (tmX < 0 && titleTarget == 0) {
          this.setData({
            titleTarget: 1,
            fromTarget: null
          });
        } else if (tmX >= 0 && titleTarget == 1) {
          this.setData({
            titleTarget: 0,
            fromTarget: null
          });
        } else if (tmX < 0 && titleTarget == 1) {
          this.setData({
            titleTarget: 2,
            fromTarget: null
          });
        } else if (tmX >= 0 && titleTarget == 2) {
          this.setData({
            titleTarget: 1,
            fromTarget: null
          });
        } else if (tmX < 0 && titleTarget == 2) {
          this.setData({
            titleTarget: 0,
            fromTarget: null
          });
        } else if (tmX >= 0 && titleTarget == 0) {
          this.setData({
            titleTarget: 2,
            fromTarget: null
          });
        }  else {
          return;
        }
      }
    }
    clearInterval(interval);
    time = 0;
  },
})