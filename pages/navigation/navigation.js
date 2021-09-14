var app = getApp();
import Notify from '@vant/weapp/notify/notify';
const { request } = require("../../utils/request/request");
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const qqmapsdk = new QQMapWX({
	key: '4JUBZ-3YMK6-PFRSG-E5RZQ-OTE52-62BHM' // 必填
});
Page({
  data: {
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    contentHeight: app.globalData.contentHeight,
    activeColor: '#EEC174',
    showPopup: false,
    position: 0,
    latitude: 28.746301,
    longitude: 115.86862,
    active: 0,
    key: '4JUBZ-3YMK6-PFRSG-E5RZQ-OTE52-62BHM',
    skew: 0,
    polyline: [{
      color: '#EEC174',
      dottedLine: false,
      width: 5,
      zIndex: 10,
      float_list: [
        {name: '北31栋'},
        {name: '北32栋'},
        {name: '北33栋'},
      ],
      points: [
        {latitude:28.75408,longitude:115.86877},
        {latitude:28.754094,longitude:115.868871},
        {latitude:28.752911,longitude:115.87185},
        {latitude:28.752848,longitude:115.871882},
        {latitude:28.752428,longitude:115.871689},
        {latitude:28.752263,longitude:115.872247},
        {latitude:28.752059,longitude:115.872297},
        {latitude:28.752061,longitude:115.872661},
        {latitude:28.743558,longitude:115.87263},
        {latitude:28.743125,longitude:115.872682},
        {latitude:28.743091,longitude:115.874133},
        {latitude:28.742234,longitude:115.874135},
        {latitude:28.741682,longitude:115.874024},
        {latitude:28.741612,longitude:115.873448},
        {latitude:28.74008,longitude:115.873458},
        {latitude:28.740072,longitude:115.874105},
        {latitude:28.739842,longitude:115.874234},
        {latitude:28.737691,longitude:115.875359},
        {latitude:28.7378,longitude:115.876508},
        {latitude:28.737803,longitude:115.876593},
        {latitude:28.737027,longitude:115.877172},
        {latitude:28.737008,longitude:115.877669},
        {latitude:28.737264,longitude:115.87798},
        {latitude:28.737397,longitude:115.878152},
        {latitude:28.737745,longitude:115.878212},
        {latitude:28.737879,longitude:115.878369},
        {latitude:28.73842,longitude:115.878513},
        {latitude:28.738477,longitude:115.878568},
        {latitude:28.738503,longitude:115.87871},
        {latitude:28.737835,longitude:115.87923},
        {latitude:28.737339,longitude:115.879417},
        {latitude:28.737253,longitude:115.879396},
        {latitude:28.736295,longitude:115.878808},
        {latitude:28.735878,longitude:115.87806},
        {latitude:28.734983,longitude:115.877331},
        {latitude:28.734297,longitude:115.877029},
        {latitude:28.733389,longitude:115.876813},
        {latitude:28.733362,longitude:115.876815},
        {latitude:28.73244,longitude:115.876869},
        {latitude:28.732213,longitude:115.876882},
        {latitude:28.731996,longitude:115.87684},
        {latitude:28.731593,longitude:115.876812},
        {latitude:28.73147,longitude:115.876786},
        {latitude:28.731206,longitude:115.876591},
        {latitude:28.730931,longitude:115.876499},
        {latitude:28.730989,longitude:115.875221},
        {latitude:28.73106,longitude:115.874516},
        {latitude:28.731205,longitude:115.874021},
        {latitude:28.73145,longitude:115.873578},
        {latitude:28.731466,longitude:115.873242},
        {latitude:28.731705,longitude:115.872496},
        {latitude:28.731953,longitude:115.871826},
        {latitude:28.732194,longitude:115.871461},
        {latitude:28.732469,longitude:115.87117},
        {latitude:28.732603,longitude:115.871064},
        {latitude:28.733336,longitude:115.870136},
        {latitude:28.733011,longitude:115.869655},
        {latitude:28.732916,longitude:115.869205},
        {latitude:28.733011,longitude:115.86871},
        {latitude:28.732936,longitude:115.868585},
        {latitude:28.732909,longitude:115.86849},
        {latitude:28.732877,longitude:115.868001},
        {latitude:28.732919,longitude:115.867927},
        {latitude:28.732938,longitude:115.86791},
        {latitude:28.733554,longitude:115.867761},
        {latitude:28.73429,longitude:115.867593},
        {latitude:28.735024,longitude:115.867468},
        {latitude:28.735571,longitude:115.867351},
        {latitude:28.736162,longitude:115.867228},
        {latitude:28.736996,longitude:115.867067},
        {latitude:28.73818,longitude:115.866761},
        {latitude:28.740018,longitude:115.8663},
        {latitude:28.743882,longitude:115.865764},
        {latitude:28.744992,longitude:115.865589},
        {latitude:28.745106,longitude:115.865567},
        {latitude:28.748041,longitude:115.865088},
        {latitude:28.749533,longitude:115.865866},
        {latitude:28.753141,longitude:115.867691},
        {latitude:28.753147,longitude:115.867728},
        {latitude:28.753174,longitude:115.867806},
        {latitude:28.753163,longitude:115.867909},
        {latitude:28.753046,longitude:115.868189},
        {latitude:28.754055,longitude:115.868709},
        {latitude:28.75408,longitude:115.86877}
      ]
    }]
  },
  onLoad: function (options) {
    let accountInfo = wx.getStorageSync('accountInfo');
    request({
      url: "api/map/address", 
      method: 'GET',
    }).then(res =>{
      console.log(res);
      Notify({
        message: '获取位置点成功,双指缩放查看地图',
        duration: 1200,
        safeAreaInsetTop: true,
        type: 'warning'
      });
      let arrList = res.data;
      for(let i=0;i<arrList.length;i++){
        for(let j=0;j<arrList[i].length;j++){
          arrList[i][j].iconPath = "https://v.powerv.top/static/img/address/" + res.data[i][j].iconPath + ".png";
        }
      }
      this.setData({
        markers0: res.data[0],
        markers1: res.data[1],
        markers2: res.data[2],
        markers3: res.data[3],
      })
      let str = "polyline[0].color";
      this.setData({
        accountInfo: accountInfo,
        markers: res.data[1],
        [str]: '#EEC174'
      })
    })

  },
  onShow: function () {
    const that = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true)                     {
          wx.showModal({
            title: '请求授权当前位置信息',
            content: '使用校园定位、导航、路线规划等功能需要授权位置信息',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (res) {
                    if (res.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      that.goAddress();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          that.goAddress();
        }
        else {
          that.goAddress();
        }
      }
    })
  },
  changePositon(e){
    let that = this
    let position = that.data.position;
    let active = that.data.active;
    if (active == 1) {
      var type = 'success';
    } else {
      var type = 'warning';
    }
    if(position==0){
      Notify({
        message: '切换南区',
        safeAreaInsetTop: true,
        duration: 600,
        type: type
      });
      that.setData({
        position: 1,
        latitude: 28.737734,  
        longitude: 115.870206,
      })
    }else{
      Notify({
        message: '切换北区',
        safeAreaInsetTop: true,
        duration: 600,
        type: type
      });
      that.setData({
        position: 0,
        latitude: 28.746301,
        longitude: 115.86862,
      })
    }
  },
  bindmarkertap(e){
    let that = this;
    let markers0 = this.data.markers0; 
    let markers1 = this.data.markers1; 
    let markers2 = this.data.markers2; 
    let markers3 = this.data.markers3; 
    let active = this.data.active;
    let markerId = e.detail.markerId;
    if (active == 0) {
      var currMaker = markers1[markerId];
    } else if (active == 1) {
      var currMaker = markers0[markerId];
    } else if (active == 2) {
      var currMaker = markers2[markerId];
    } else if (active == 3) {
      var currMaker = markers3[markerId];
      console.log(currMaker);
    }
    console.log(markerId);
    console.log(currMaker);
    let end = String(currMaker.latitude + ',' + currMaker.longitude);
    console.log(end)
    wx.vibrateShort();//手机振动
    that.setData({
      currMaker:currMaker,
    })
    qqmapsdk.calculateDistance({
      //mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
      //from参数不填默认当前地址
      //获取表单提交的经纬度并设置from和to参数（示例为string格式）
      from: '', //若起点有数据则采用起点坐标，若为空默认当前地址
      to: end, //终点坐标
      success: function (res) {//成功后的回调
        console.log(res);
        var res = res.result;
        var dis = [];
        for (var i = 0; i < res.elements.length; i++) {
          dis.push(res.elements[i].distance); //将返回数据存入dis数组，
        }
        var takeTime=Number(dis * 0.015).toFixed(0);
       if(takeTime<60){
       }else{
         takeTime=Math.round(takeTime/60)  + "小时" + parseInt(takeTime % 60);
       }
        if(dis < 1000){
          var dis=dis+"米"
        }else if(dis > 1000){
          console.log()
          var dis=(Math.round(dis/100)/10).toFixed(1) + "公里"
      }
        that.setData({ //设置并更新distance数据
          distance: dis,
          takeTime: takeTime,
          showPopup: true
        })
      },fail: function(error) {
        console.error(error);
      },
    })
  },
  gomapiftion:function(e){
    let plugin = requirePlugin('routePlan');
    let key = '4JUBZ-3YMK6-PFRSG-E5RZQ-OTE52-62BHM';  //使用在腾讯位置服务申请的key
    let mode='walking';
    let referer = '一目校园';   //调用插件的app的名称
    let endPoint = JSON.stringify({  //终点
      'name': this.data.currMaker.address_name,
      'latitude': this.data.currMaker.latitude,
      'longitude': this.data.currMaker.longitude
    });
    wx.navigateTo({
        url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint +'&mode=' + mode
    });
    console.log(this.data.currMakerctname)
  },
  // 跳转到详情页
  godetails(e){
    this.setData({ showPopup: false})
    wx.navigateTo({
      url: '/pages/navigation/details/details?data='+JSON.stringify(this.data.currMaker),
    })
  },
  onChange(event) {
    let active = event.detail.name;
    let markers0 = this.data.markers0;
    let markers1 = this.data.markers1;
    let markers2 = this.data.markers2;
    let markers3 = this.data.markers3;
    let str = "polyline[0].color";
    if (active == 0) {
      Notify({
        message: '宿舍、超市、饮食、便民',
        safeAreaInsetTop: true,
        duration: 800,
        type: 'warning'
      });
      this.setData({
        markers: markers1,
        [str]: '#EEC174',
        activeColor: '#EEC174'
      })
    } else if (active == 1) {
      Notify({
        message: '教学、实验、学院',
        safeAreaInsetTop: true,
        duration: 800,
        type: 'success'
      });
      this.setData({
        markers: markers0,
        [str]: '#709E8D',
        activeColor: '#709E8D'
      })
    } else if (active == 2) {
      Notify({
        message: '菜鸟、顺丰、京东、其他快递',
        safeAreaInsetTop: true,
        duration: 800,
        type: 'primary'
      });
      this.setData({markers:markers2})
    } else if (active == 3) {
      this.setData({markers:markers3})
    }
    this.setData({
      active: active,
    })
  },
  popClose() {
    this.setData({ showPopup: false });
  },
  BackPage() {
    wx.navigateBack({
        delta: 1,
    }); 
  },
  onShareAppMessage: function (res) {
    return {
      title: '大学查课表成绩选课，还有更多功能等你探索',
      path: '/pages/blank/blank',
    }
  }
})