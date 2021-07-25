var app = getApp();
let touchDotX = 0;//X按下时坐标
let touchDotY = 0;//y按下时坐标
let interval;//计时器
let time = 0;//从按下到松开共多少时间*100
Page({
  data: {
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    contentHeight: app.globalData.contentHeight,
    colorList: app.globalData.glassColor,
    hasStatus: false,
    hasUserInfo: false,
    bfBtn: 'checked',
    afBtn: 'no-checked',
    lastTap: 0,
    msgList: [
      {title: '卢江涛',detail: '想请教同学一下高数的学习方法想请教同学一下大物的学习方法',time: '今天 08:52',url: '../../images/inbox/lu.jpg'},
      {title: '王志良',detail: '想请教同学一下高数的学习方法',time: '三天前 19:46',url: '../../images/inbox/wang.jpg'},
    ],
    affairList: [
      {title: '大学物理Ⅰ',detail: '31栋605',remark: '万永强',startTime: '08:00',endTime: '09:40',imgUrl: '../../images/index/dawu.jpg',fromUrl: '/images/conmon/boy.png'},
      {title: '高等数学Ⅰ',detail: '31栋421',remark: '刘二根',startTime: '10:30',endTime: '12:10',
      imgUrl: '../../images/index/gaoshu.jpeg',fromUrl: '/images/conmon/girl.png'},
      {title: '大学物理Ⅰ',detail: '31栋605',remark: '万永强',startTime: '14:30',endTime: '16:10',imgUrl: '../../images/index/dawu.jpg',fromUrl: '/images/conmon/boy.png'},
      {title: '高等数学Ⅰ',detail: '31栋421',remark: '刘二根',startTime: '16:40',endTime: '18:10',imgUrl: '../../images/index/gaoshu.jpeg',fromUrl: '/images/conmon/girl.png'},
    ],
    bindList: [
      {title: '高等数学Ⅰ',detail: '31栋421',remark: '刘二根',startTime: '10:30',endTime: '12:10',
      imgSrc: '../../images/index/gaoshu.jpeg'},
      {title: '大学物理Ⅰ',detail: '31栋605',remark: '万永强',startTime: '08:00',endTime: '09:40',imgSrc: '../../images/index/dawu.jpg'},
      {title: '高等数学Ⅰ',detail: '31栋421',remark: '刘二根',startTime: '16:40',endTime: '18:10',imgSrc: '../../images/index/gaoshu.jpeg'},
      {title: '大学物理Ⅰ',detail: '31栋605',remark: '万永强',startTime: '14:30',endTime: '16:10',imgSrc: '../../images/index/dawu.jpg'},

    ],
  },
  onLoad: function (options) {
    let that = this;
    wx.request({
      url: 'https://international.v1.hitokoto.cn/',
      success(res) {
        console.log(res);
        that.setData({
          oneWord:res.data
        })
      },
      fail(res) {
        console.log("--fail--");
      },
    })
  },
  onShow: function () {
    let status = wx.getStorageSync('status');
    if(status!=''){
    this.setData({
      status: status,
      hasStatus: true
    })
    } else {
      this.setData({
        hasStatus: false
      })
    }
  },
  getUserProfile(e) {
    wx.getUserProfile({
      desc: '用于优化用户体验',
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  bfBtn: function(){
    this.setData({
      bfBtn: 'checked',
      afBtn: 'no-checked'
    })
  },
  afBtn: function(){
    this.setData({
      bfBtn: 'no-checked',
      afBtn: 'checked'
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
      lastTap
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
        if (tmX < 0 && lastTap == 0) {
          this.setData({
            bfBtn: 'no-checked',
            afBtn: 'checked',
            lastTap: 1,
          });
        } else if (tmX >= 0 && lastTap == 1) {
          this.setData({
            bfBtn: 'checked',
            afBtn: 'no-checked',
            lastTap: 0,
          });
        } else if (tmX < 0 && lastTap == 1) {
          this.setData({
            bfBtn: 'checked',
            afBtn: 'no-checked',
            lastTap: 0,
          });
        } else if (tmX >= 0 && lastTap == 0) {
          this.setData({
            bfBtn: 'no-checked',
            afBtn: 'checked',
            lastTap: 1,
          });
        }  else {
          return;
        }
      }
    }
    clearInterval(interval); // 清除setInterval
    time = 0;
  },
  navTo: function(e){
    let url = e.currentTarget.dataset.url;
    console.log(e);
    wx.navigateTo({
      url: '/pages/'+ url +'/'+ url,
    })
  },
  viewAll: function(){
    wx.navigateTo({
      url: '/pages/inbox/inbox',
    })
  }
})