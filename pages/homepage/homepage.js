var app = getApp();
import Notify from '@vant/weapp/notify/notify'; // 通知
var myBase64 = require("../../utils/mybase64.js");
const { request } = require("../../utils/request/request");
Page({
    data: {
        menuButtonTop: app.globalData.menuButtonTop,
        menuButtonHeight: app.globalData.menuButtonHeight,
        contentHeight: app.globalData.contentHeight,
        titleTarget: 0,
        scrollTop: 0,
        offsetTop: 0,
        QA_bg: [ // 问答背景
            {color: '#666699',type: '闲聊'},
            {color: '#FF6666',type: '情感'},
            {color: '#003399',type: '学习'},
            {color: '#FFCC99',type: '生活'},
            {color: '#339999',type: '求购'},
            {color: '#E76A8D',type: '表白'},
            {color: '#66CC99',type: '求助'},
        ],
    },
    onLoad(options){
        if(options.from == 'self'){
            let infoTitle = ['问答','点赞过的','我的活动','我的分享'];
            this.setData({
                from: 'self',
                infoTitle: infoTitle,
                accountInfo: wx.getStorageSync('accountInfo'),
            })

            // 获取我的问答
            request({
                url: "api/qa/mylist?" , 
                method: 'GET',header: {'cookie':wx.getStorageSync('sessionid')}
            }).then(res =>{
                console.log(res.data);
                let QA_mine = res.data;
                for(let i=0;i<QA_mine.length;i++){
                    let QA_bg = this.data.QA_bg;
                    for(let j=0;j<QA_bg.length;j++){
                        if (QA_mine[i].type == QA_bg[j].type) {
                            QA_mine[i].color = QA_bg[j].color;
                        }
                    }
                if(QA_mine[i].reply_content != null){
                    let reply_content = myBase64.decode(QA_mine[i].reply_content);
                    QA_mine[i].reply_content = reply_content;
                }
                if(QA_mine[i].openname != null){
                    let openname = myBase64.decode(QA_mine[i].openname);
                    QA_mine[i].openname = openname;
                }
                let picture1 = QA_mine[i].picture1;
                let picture2 = QA_mine[i].picture2;
                if (picture1 != null) {
                    QA_mine[i].picture1 = "https://static.powerv.top/static/img/QAImg/" + picture1;
                }
                if (picture2 != null) {
                    QA_mine[i].picture2 = "https://static.powerv.top/static/img/QAImg/" + picture2;
                }
                }
                this.setData({
                    QA_mine: QA_mine,
                    QALoading: false
                })
                Notify({
                    message: '获取到 ' + res.data.length + ' 条问答',
                    type: 'success ',
                    safeAreaInsetTop: true,
                    duration: '600'
                });
            })
        } else {
            let content = JSON.parse(decodeURIComponent(options.content));
            let infoTitle = ['问答','点赞过的','Ta参加的','Ta的分享'];
            this.setData({
                from: 'other',
                content: content,
                infoTitle: infoTitle
            })
        }
    },
    // 跳转问答详情
    navQAPost(e){
        let {
            content,
            from,
            id
        } = e.currentTarget.dataset;
        if (from == 'checkImg') {
            wx.navigateTo({url: '/pages/QAPost/QAPost?from=checkImg&content=' + encodeURIComponent(JSON.stringify(content)) + '&id=' + id});
        } else {
            wx.navigateTo({url: '/pages/QAPost/QAPost?content=' + encodeURIComponent(JSON.stringify(content))});
        }
    },
    navAlterInfo(){
        wx.navigateTo({url: '../mine/alterInfo/alterInfo'});
    },
    swiftTap(e){
        let titleTarget = e.currentTarget.dataset.id;
        this.setData({ titleTarget: titleTarget });
    },
    onScroll(event) {
        wx.createSelectorQuery()
        .select('#scroller')
        .boundingClientRect((res) => {
            this.setData({
                scrollTop: event.detail.scrollTop,
                offsetTop: res.top,
            });
        })
        .exec();
    },
    BackPage() {
        wx.navigateBack({ delta: 1 }); 
    },
    navTo(){
        let link = 'https://mp.weixin.qq.com/s/W7f7Y53jtKBu5TwRXUY4gw';
        wx.navigateTo({url: '../../publicPage/publicPage?link=' + encodeURIComponent(JSON.stringify(link))});
    },
    onShareAppMessage(){

    }
})