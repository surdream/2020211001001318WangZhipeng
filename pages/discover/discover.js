import Notify from '@vant/weapp/notify/notify'; // 通知
var app = getApp();
const { request } = require("../../utils/request/request");
Page({
    data: {
        menuButtonTop: app.globalData.menuButtonTop,
        menuButtonHeight: app.globalData.menuButtonHeight,
        contentHeight: app.globalData.contentHeight,
        card_list:[
            {
                tag: '报名12月7日起',
                type: '社团活动',
                title: '青愿托儿所志愿者',
                detail: '献出你的关爱',
                background: '#666699',
                method: '去报名',
                award: '综测可加分'
            },
            {
                tag: '截止11月20日',
                type: '校级竞赛',
                title: '双基服务外包比赛',
                detail: '12月初进行决赛，抓住机会哦',
                background: '#FF6666',
                method: '去了解',
                award: '综测科创均可加分'
            },
            {
                tag: '限时11月10-11日',
                type: '社会劳动',
                title: '北区菜鸟驿站分拣员',
                detail: '白班120，夜班160',
                background: '#FFCC99',
                method: '去报名',
                award: '校园实践积分+0.5'
            }
        ]
    },
    onLoad(options){
        this.setData({ accountInfo: wx.getStorageSync('accountInfo') });
    },
    onShow(){

    },
    navHomepage(){
        wx.navigateTo({url: '../homepage/homepage?from=self'});
    },
    navTarget(e){
        console.log(e.currentTarget.dataset.content);
        let content = e.currentTarget.dataset.content;
        wx.navigateTo({url: './targetInfo/targetInfo?content=' + encodeURIComponent(JSON.stringify(content))});
    },
    onShareAppMessage(){
        return {
            title: '大学查课表成绩选课，还有更多功能等你探索',
            path: '/pages/blank/blank'
        }
    }
})