var app = getApp();
let touchDotX = 0;//X按下时坐标
let touchDotY = 0;//y按下时坐标
let interval;//计时器
let time = 0;//从按下到松开共多少时间*100
Page({
  data: {
    colorList: app.globalData.glassColor,
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    contentHeight: app.globalData.contentHeight,
    courentWeek: '16',
    titleTarget: 0,
    pickerIndex: 0,
    default: '2020-1学期',
    pickerImg:'/images/office/down-tri.png',
    officeColorList: [
      '#7BDEE8','#EE7785','#E3C160','#C1E965'
    ],
    userInfo: {
      schUrl: '/images/conmon/ecjtu.jpg'
    },
    courseList: [
      {title: '高等数学Ⅰ',teacher: '刘二根',address: '31栋218',class: '2020-2小二班',microNum: '23'},
      {title: '高等数学Ⅰ',teacher: '刘二根',address: '31栋218',class: '2020-2小二班',microNum: '23'},
      {title: '高等数学Ⅰ',teacher: '刘二根',address: '31栋218',class: '2020-2小二班',microNum: '23'},
      {title: '高等数学Ⅰ',teacher: '刘二根',address: '31栋218',class: '2020-2小二班',microNum: '23'},
    ],
    infoListTitle: [
      {name: '我的课表'},{name: '查询成绩'},{name: '考试安排'}
    ],
    chart_list: [
      {
        time: '上午 08:00 - 09:40',
        title: '高等数学Ⅰ',
        teacher: '刘二根',
        address: '31栋306',
        type: '必修课',
        credit: '6',
        imgList:[
          {url:'/images/conmon/girl.png'},
          {url:'/images/conmon/boy.png'},
          {url:'/images/conmon/girl.png'},
          {url:'/images/conmon/boy.png'},
          {url:'/images/conmon/girl.png'},
          {url:'/images/conmon/boy.png'},
        ]
      },
      {
        time: '上午 08:00 - 09:40',
        title: '高等数学Ⅰ',
        teacher: '刘二根',
        address: '31栋306',
        type: '必修课',
        credit: '6',
        imgList:[
          {url:'/images/conmon/girl.png'},
          {url:'/images/conmon/boy.png'},
          {url:'/images/conmon/girl.png'},
          {url:'/images/conmon/boy.png'},
          {url:'/images/conmon/girl.png'},
          {url:'/images/conmon/boy.png'},
          {url:'/images/conmon/girl.png'},
          {url:'/images/conmon/boy.png'},
        ]
      },
      {
        time: '上午 08:00 - 09:40',
        title: '高等数学Ⅰ',
        teacher: '刘二根',
        address: '31栋306',
        type: '必修课',
        credit: '6',
        imgList:[
          {url:'/images/conmon/girl.png'},
          {url:'/images/conmon/boy.png'},
        ]
      },
      {
        time: '上午 08:00 - 09:40',
        title: '高等数学Ⅰ',
        teacher: '刘二根',
        address: '31栋306',
        type: '必修课',
        credit: '6',
        imgList:[
          {url:'/images/conmon/girl.png'},
          {url:'/images/conmon/boy.png'},
          {url:'/images/conmon/girl.png'},
          {url:'/images/conmon/boy.png'},
        ]
      },
    ],
    grade_list: [
      {
        grade: '72',
        rank: '6',
        gpa: '1.2',
        title: '高等数学Ⅰ',
        teacher: '刘二根',
        type: '必修课',
        credit: '6',
        imgList:[
          {url:'/images/conmon/girl.png'},
          {url:'/images/conmon/boy.png'},
          {url:'/images/conmon/girl.png'},
          {url:'/images/conmon/boy.png'},
          {url:'/images/conmon/girl.png'},
          {url:'/images/conmon/boy.png'},
        ]
      },
      {
        grade: '优秀',
        gpa: '0.6',
        title: '电子工艺实习',
        teacher: '陈云',
        type: '选修课',
        credit: '2',
        imgList:[
          {url:'/images/conmon/girl.png'},
          {url:'/images/conmon/boy.png'},
          {url:'/images/conmon/girl.png'},
          {url:'/images/conmon/boy.png'},
          {url:'/images/conmon/girl.png'},
          {url:'/images/conmon/boy.png'},
          {url:'/images/conmon/girl.png'},
          {url:'/images/conmon/boy.png'},
        ]
      },
    ],
    arrange_list: [
      {        
        date: '7月28日',
        time: '上午 08:00 - 09:40',
        title: '高等数学Ⅰ',
        teacher: '刘二根',
        address: '31栋306',
        type: '必修课',
        credit: '6',
        imgList:[
          {url:'/images/conmon/girl.png'},
          {url:'/images/conmon/boy.png'},
          {url:'/images/conmon/girl.png'},
          {url:'/images/conmon/boy.png'},
          {url:'/images/conmon/girl.png'},
          {url:'/images/conmon/boy.png'},
        ]
      },
    ],
    term_array: ['2019-1学期', '2019-2学期', '2020-1学期', '2020-2学期', '2021-1学期', '2021-2学期'],
    term_objectArray: [
      {
        id: 0,
        name: '2019-1学期'
      },
      {
        id: 1,
        name: '2019-2学期'
      },
      {
        id: 2,
        name: '2020-1学期'
      },
      {
        id: 3,
        name: '2020-2学期'
      },
      {
        id: 4,
        name: '2021-1学期'
      },
      {
        id: 5,
        name: '2021-2学期'
      }
    ],
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
  bindCoursePickerChange: function (e) {
    let index = e.detail.value
    let term_array = this.data.term_array
    console.log('picker发送选择改变，携带值为', index)
    this.setData({
      index: e.detail.value,
      default: term_array[index],
      choose_term: index
    })
    switch (this.data.choose_term) {
      case '0': {
        this.setData({
          choose_term: '2019_1'
        })
      } break;
      case '1': {
        this.setData({
          choose_term: '2019_2'
        })
      } break;
      case '2': {
        this.setData({
          choose_term: '2020_1'
        })
      } break;
      case '3': {
        this.setData({
          choose_term: '2020_2'
        })
      } break;
      case '4': {
        this.setData({
          choose_term: '2021_1'
        })
      } break;
      case '5': {
        this.setData({
          choose_term: '2021_2'
        })
      } break;
    }
  },
  pickerTap(){
    this.setData({
      pickerImg:'/images/office/up-tri.png'
    })
  },
  pickerCancel(){
    this.setData({
      pickerImg:'/images/office/down-tri.png'
    })
  },
  navTo(e){
    let url = e.currentTarget.dataset.url;
    if(url === 'office-calendar'){
      wx.navigateTo({
        url: '/pages/office-calendar/office-calendar',
      })
    } else if(url === 'note'){
      wx.navigateTo({
        url: '/pages/note/note',
      })
    } else if(url === 'office-testify'){
      wx.navigateTo({
        url: '/pages/office-testify/office-testify',
      })
    } else if(url === 'office-target'){
      wx.navigateTo({
        url: '/pages/office-target/office-target',
      })
    }

  }
})