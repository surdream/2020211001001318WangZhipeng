var app = getApp();
var time = require('../../utils/util.js');
Page({
  data: {
    loading: true,
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    startDate: '2021/9/1',
    endDate: '2022/2/18',
    formatter(day) {
      const month = day.date.getMonth() + 1;
      const date = day.date.getDate();
      let week = day.date.getDay()
      if (week === 0) week = 7
      if (week === 6||week === 7){
        day.topInfo = '周末';
      }
      if (day.type === 'start'){
        day.bottomInfo = ''
      } else if(day.type === 'end'){
        day.bottomInfo = ''
      }
      if (month === 9) {
        if (date === 1) {
          day.topInfo = '开学';
          day.type = 'start';
          day.bottomInfo = '正式上课'
        } else if (date === 2) {
          day.type = '';
        } else if (date === 3) {
          day.topInfo = '新生';
          day.type = 'start';
          day.bottomInfo = '21级'
        } else if (date === 4) {
          day.type = 'middle';
        } else if (date === 5) {
          day.topInfo = '报到';
          day.type = 'end';
        } else if (date === 10) {
          day.topInfo = '教师节';
        } else if (date === 13) {
          day.topInfo = '开学典礼';
          day.type = 'end';
          day.bottomInfo = '21级';
        } else if (date === 19) {
          day.topInfo = '校庆';
          day.type = 'start';
          day.bottomInfo = '50周年';
        } else if (date === 21) {
          day.topInfo = '中秋节';
          day.type = 'start';
          day.bottomInfo = '调休';
        } else if (date === 23) {
          day.topInfo = '秋分';
        }
      }
      if (month === 10) {
        if (date === 1) {
          day.topInfo = '国庆节';
          day.type = 'start';
          day.bottomInfo = '开始';
        } else if (date > 1 && date < 7) {
          day.type = 'middle';
        } else if (date === 7) {
          day.topInfo = '国庆节';
          day.type = 'end';
          day.bottomInfo = '结束';
        } else if (date === 8) {
          day.topInfo = '寒露';
        } else if (date === 14) {
          day.topInfo = '重阳';
        } else if (date === 23) {
          day.topInfo = '霜降';
        } else if (date === 27) {
          day.topInfo = '校运会';
          day.type = 'start';
          day.bottomInfo = '开幕式';
        } else if (date > 27 && date < 29) {
          day.type = 'middle';
        } else if (date === 29) {
          day.topInfo = '校运会';
          day.type = 'end';
          day.bottomInfo = '闭幕式';
        } else if (date === 31) {
          day.topInfo = '万圣夜';
        } 
      }
      if (month === 11) {
        if (date === 1) {
          day.topInfo = 'Orz';
          day.bottomInfo = '无假期';
        } else if (date === 7) {
          day.topInfo = '立冬';
        } else if (date === 11) {
          day.topInfo = '光棍节';
        } else if (date === 22) {
          day.topInfo = '小雪';
        } else if (date === 25) {
          day.topInfo = '感恩节';
        }
      }
      if (month === 12) {
        if (date === 1) {
          day.topInfo = 'Orz';
          day.bottomInfo = '无假期';
        } else if (date === 7) {
          day.topInfo = '大雪';
        } else if (date === 21) {
          day.topInfo = '冬至';
        } else if (date === 24) {
          day.topInfo = '平安夜';
        } else if (date === 25) {
          day.topInfo = '圣诞节';
        } else if (date === 31) {
          day.topInfo = '跨年夜';
        }
      }
      if (month === 1) {
        if (date === 1) {
          day.topInfo = '元旦';
          day.type = 'start';
          day.bottomInfo = '调休';
        } else if (date === 5) {
          day.topInfo = '小寒';
        } else if (date === 10) {
          day.topInfo = '寒假';
          day.type = 'start';
          day.bottomInfo = '开始';
        } else if (date === 20) {
          day.topInfo = '大寒';
          day.type = 'middle';
        } else if (date === 25) {
          day.topInfo = '北方小年';
          day.type = 'middle';
        } else if (date === 26) {
          day.topInfo = '南方小年';
          day.type = 'middle';
        } else if (date > 10 && date <= 31) {
          day.type = 'middle';
        }
      }
      if (month === 2) {
        if (date === 1) {
          day.topInfo = '春节';
          day.type = 'start';
          day.bottomInfo = '新年快乐';
        } else if (date > 1 && date < 18) {
          day.type = 'middle';
        } else if (date === 18) {
          day.topInfo = '寒假';
          day.type = 'end';
          day.bottomInfo = '结束';
        }
      }
      return day;
    },
  },
  onLoad: function (options) {
    var timestamp = Date.parse(new Date());
        timestamp = timestamp / 1000;
    let courentDay = time.formatTimeRev(timestamp,'Y/M/D');
    let startDate = this.data.startDate.replace(/-/g,'/');
    let endDate = this.data.endDate.replace(/-/g,'/');
    let bfDiff = ((Date.parse(courentDay))-(Date.parse(startDate)))/86400000;
    let afDiff = ((Date.parse(endDate))-(Date.parse(courentDay)))/86400000;
    if (bfDiff > 0 && afDiff >0) {
      this.setData({
        courentDay: courentDay,
        bfDiff: bfDiff + '天',
        afDiff: afDiff + '天'
      })
    } else {
      this.setData({
        courentDay: courentDay,
        bfDiff: '还在放假',
        afDiff: '开学再查'
      })
    }
  },
  onShow: function () {

  },
  BackPage() {
    wx.navigateBack({
        delta: 1,
    });
  },
})