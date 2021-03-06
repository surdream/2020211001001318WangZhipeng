import Notify from '@vant/weapp/notify/notify';
import Toast from '@vant/weapp/toast/toast';
import Dialog from '@vant/weapp/dialog/dialog';
var app = getApp();
var myBase64 = require("../../utils/mybase64.js");
const { request } = require("../../utils/request/request");
Page({
  data: {
    menuButtonTop: app.globalData.menuButtonTop,
    menuButtonHeight: app.globalData.menuButtonHeight,
    contentHeight: app.globalData.contentHeight,
    msgValue: '',
    focus: false,
    loading: true,
    backHome: false,
    showShare: false,
    topActionShow: false,
    midActionShow: false,
    btmActionShow: false,
    selectId: null,
    QALoading: true,
    QAEnd: false,
    imgUrl: [],
    selfList: [],
    answerList: [],
    topActions: [
      { name: '分享', openType: 'share' },
      { name: '举报', subname: '收到您的举报后，我们会尽快进行核查' },
    ],
    midActions: [
      { name: '分享', openType: 'share' },
      { name: '删除' }
    ],
    btmActions: [
      { name: '分享', openType: 'share' },
      { name: '举报', }
    ],
    options: [
      { name: '微信', icon: 'wechat', openType: 'share' },
      { name: '复制链接', icon: 'link' },
    ],
  },
  onLoad(options){
    let from = options.from;
    let content = JSON.parse(decodeURIComponent(options.content));
    let imgUrl = [content.picture1].concat([content.picture2]);
    let QAMsgValue = wx.getStorageSync('QAMsgValue');
    if (QAMsgValue != '') {
      Toast('检测到有正在编辑的内容，已为您自动恢复');
    }
    this.setData({
      content: content,
      imgUrl: imgUrl,
      msgValue: QAMsgValue,
      accountInfo: wx.getStorageSync('accountInfo')
    })
    // 热门回答
    request({
      url: "api/qa/question?id=" + content.question_id, 
      method: 'GET',header: {'cookie':wx.getStorageSync('sessionid')}
    }).then(res =>{
      console.log(res.data);
      let answerList = res.data;
      let userid = wx.getStorageSync('accountInfo').userid;
      for(let i=0;i<answerList.length;i++){
        if (answerList[i].userid == userid) {
          answerList[i].show = false;
        } else {
          let content = myBase64.decode(answerList[i].content);
          let openname = myBase64.decode(answerList[i].openname);
          answerList[i].content = content;
          answerList[i].openname = openname;
          answerList[i].show = true;
        }
      }
      this.setData({
        QALoading: false,
        answerList: answerList
      })
    })
    // 我的回答
    request({
      url: "api/qa/question?id=" + content.question_id + "&have=-1",
      method: 'GET',header: {'cookie':wx.getStorageSync('sessionid')}
    }).then(res =>{
      console.log(res.data);
      let selfList = res.data;
      for(let i=0;i<selfList.length;i++){
        let content = myBase64.decode(selfList[i].content);
        let openname = myBase64.decode(selfList[i].openname);
            selfList[i].content = content;
            selfList[i].openname = openname;
      }
      this.setData({
        QALoading: false,
        selfList: selfList
      })
    })
    if(from == 'share'){this.setData({ backHome: true })}
    if(from == 'checkImg') {
      let imgUrl = this.data.imgUrl;
      console.log(imgUrl)
      let id = parseInt(options.id) - 1;
      wx.previewImage({
        urls: imgUrl,
        current: imgUrl[id],
        success: function (res) { console.log(res) },
        fail: function (res) { console.log(res) },
        complete: function (res) { console.log(res) },
      })
    }
  },
  // 标签相关
  tagTap(){
    let type = this.data.content.type;
    Toast(type + '墙');
  },
  // 跳转我的主页
  navSelfpage(){
    wx.navigateTo({url: '../homepage/homepage?from=self'});
  },
  // 跳转个人主页
  navHomepage(e){
    let {
      id,
      content
    } = e.currentTarget.dataset;
    console.log(content)
    if(id == this.data.accountInfo.userid_show){
      wx.navigateTo({url: '../homepage/homepage?from=self'});
    } else {
      wx.navigateTo({url: '../homepage/homepage?from=other&content=' + encodeURIComponent(JSON.stringify(content))});
    }
  },
  // 输入相关
  onChange(e){
    let value = e.detail;
    this.setData({ msgValue: value });
    wx.setStorageSync('QAMsgValue', value);
  },
  topMoreBtn(){
    this.setData({ topActionShow: true })
  },
  midMoreBtn(e){
    let id = e.currentTarget.dataset.id;
    this.setData({
      selectId: id,
      midActionShow: true
    })
  },
  btmMoreBtn(e){
    this.setData({ btmActionShow: true })
  },
  inputFocus(){
    this.setData({ focus: true })
  },
  inputBlur(){
    this.setData({ focus: false })
  },
  // 发送回答相关
  sentTap(){
    let firstUse = wx.getStorageSync('firstUse');
    if(firstUse == 'not'){
      let that = this;
      let content = this.data.content;
      let msgValue = myBase64.encode(wx.getStorageSync('QAMsgValue')).replace(/\+/g, "%2B");
      if(msgValue.length == 0){
        Toast('请输入你的回答');
      } else{
        request({
          url: "api/qa/reply?id=" + content.question_id + "&content=" + msgValue, 
          method: 'GET',header: {'cookie':wx.getStorageSync('sessionid')}
        }).then(res =>{
          console.log(res.data);
          if (res.data.code == 200) { // 成功回调
            wx.showToast({ title: '回答成功！' })
            that.setData({
              msgValue: '',
              QAEnd: false
            })
            wx.removeStorageSync('QAMsgValue');
            wx.showLoading({ title: '加载中...' });
            setTimeout(function() {
              request({
                url: "api/qa/question?id=" + content.question_id + "&have=-1", 
                method: 'GET',header: {'cookie':wx.getStorageSync('sessionid')}
              }).then(res =>{
                console.log(res.data);
                let selfList = res.data;
                for(let i=0;i<selfList.length;i++){
                  let content = myBase64.decode(selfList[i].content);
                  let openname = myBase64.decode(selfList[i].openname);
                      selfList[i].content = content;
                      selfList[i].openname = openname;
                }
                that.setData({ selfList: selfList });
                // 提示弹框
                let firstSent = wx.getStorageSync('firstSent');
                if(firstSent != 'not'){
                  Dialog.alert({
                    title: '温馨提示',
                    message: '由于政策限制，一目校园小程序暂无私聊功能，如需单独沟通请自行附带联系方式',
                    theme: 'round-button',
                    confirmButtonText: '我了解了'
                  }).then(() => {
                    wx.setStorageSync('firstSent', 'not');
                  });
                }
              })
              wx.hideLoading();
            }, 2000);
          } else if (res.data.code == 401) { // 内容违规
            Toast('内容可能包含不当词汇，请重试')
            that.setData({ msgValue: '' });
            wx.removeStorageSync('QAMsgValue');
          } else if (res.data.code == 402) { // 接口异常
            let userInfo = wx.getStorageSync('userInfo');
            request({
              url: "api/user/login?" + "account=" + userInfo.account + "&password=" + userInfo.password, method: 'GET', 
            }).then(res => {
              wx.removeStorageSync('sessionid');
              wx.setStorageSync("sessionid", res.cookies[0]);
              Toast('十分抱歉，微信内容审查接口无反馈，请重试')
            })
          } else if (res.data.code == 405) { // 用户登录
            wx.login({
              success: function(res) {
                if (res.code) {
                  console.log(res);
                  //发起网络请求
                  request({
                    url: "api/user/wxbind?code=" + res.code, 
                    method: 'GET',header: {'cookie':wx.getStorageSync('sessionid')}
                  }).then(res =>{
                    console.log(res);
                    request({
                      url: "api/qa/reply?id=" + content.question_id + "&content=" + msgValue, 
                      method: 'GET',header: {'cookie':wx.getStorageSync('sessionid')}
                    }).then(res =>{
                      console.log(res.data);
                      if(res.data.code == 200){
                        wx.showToast({ title: '回答成功！' })
                        that.setData({
                          msgValue: '',
                          QAEnd: false
                        })
                        wx.removeStorageSync('QAMsgValue');
                        wx.showLoading({ title: '加载中...' });
                        setTimeout(function() {
                          request({
                            url: "api/qa/question?id=" + content.question_id + "&have=-1", 
                            method: 'GET',header: {'cookie':wx.getStorageSync('sessionid')}
                          }).then(res =>{
                            console.log(res.data);
                            let selfList = res.data;
                            for(let i=0;i<selfList.length;i++){
                              let content = myBase64.decode(selfList[i].content);
                              let openname = myBase64.decode(selfList[i].openname);
                                  selfList[i].content = content;
                                  selfList[i].openname = openname;
                            }
                            that.setData({ selfList: selfList })
                          })
                          wx.hideLoading();
                        }, 2000);
                      } else if (res.data.code == 401) {
                        Toast('内容可能包含不当词汇，请重试')
                        that.setData({ msgValue: '' });
                        wx.removeStorageSync('QAMsgValue');
                      } else if (res.data.code == 402) {
                        let userInfo = wx.getStorageSync('userInfo');
                        request({
                          url: "api/user/login?" + "account=" + userInfo.account + "&password=" + userInfo.password, method: 'GET', 
                        }).then(res => {
                          wx.removeStorageSync('sessionid');
                          wx.setStorageSync("sessionid", res.cookies[0]);
                          Toast('十分抱歉，微信内容审查接口异常，可向开发者反馈')
                        })
                      }                     
                  })
                  })
                } else {
                  console.log('获取用户登录态失败！' + res.errMsg);
                }
              }
            });
          } else if (res.data.code == 500) { // 数量超限
            Toast('回答太频繁了，最多三条哦');
            that.setData({ msgValue: '' });
            wx.removeStorageSync('QAMsgValue');
          }
        })
      }
    } else {
      Toast('校园问答功能需登录后使用');
    }
  },
  // 回复相关
  replyTap(e){
    console.log(e)
    let id = e.currentTarget.dataset.id;
    let type = e.currentTarget.dataset.type;
    let index = e.currentTarget.dataset.index;
    let answerList = this.data.answerList;
    let likes = answerList[index].likes;
    let islike = answerList[index].islike;
    let notlikes = answerList[index].notlikes;
    let isnotlike = answerList[index].isnotlike;
    if (islike == 0 && isnotlike == 0) {
      if (type == 'agree') {
        request({
          url: "api/qa/likesReply?id=" + id, 
          method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
        }).then(res =>{
          console.log(res);
          let str1 = "answerList[" + index + "].islike";
          let str2 = "answerList[" + index + "].likes";
          this.setData({ 
            [str1]: 1,
            [str2]: likes + 1
          })
          Toast(res.data.msg);
        })
      } else{
        request({
          url: "api/qa/notlikesReply?id=" + id, 
          method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
        }).then(res =>{
          console.log(res);
          let str1 = "answerList[" + index + "].isnotlike";
          let str2 = "answerList[" + index + "].notlikes";
          this.setData({ 
            [str1]: 1,
            [str2]: notlikes + 1
          })
          Toast(res.data.msg);
        })
      }
    } else if (islike == 1 && isnotlike == 0) {
      if (type == 'agree') {
        console.log(1)
        request({
          url: "api/qa/likesReply?id=" + id, 
          method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
        }).then(res =>{
          console.log(res);
          Toast(res.data.msg)
          if (res.data.code == 200) {
            let str1 = "answerList[" + index + "].islike";
            let str2 = "answerList[" + index + "].likes";
            this.setData({ 
              [str1]: 1,
              [str2]: likes + 1,
            })
          } else if (res.data.code == 300) {
            let str1 = "answerList[" + index + "].islike";
            let str2 = "answerList[" + index + "].likes";
            this.setData({ 
              [str1]: 0,
              [str2]: likes - 1,
            })
          }
        })
      } else{
        console.log('2')
        request({
          url: "api/qa/notlikesReply?id=" + id, 
          method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
        }).then(res =>{
          console.log(res);
          Toast(res.data.msg)
        })
        let str1 = "answerList[" + index + "].islike";
        let str2 = "answerList[" + index + "].likes";
        let str3 = "answerList[" + index + "].isnotlike";
        let str4 = "answerList[" + index + "].notlikes";
        this.setData({ 
          [str1]: 0,
          [str2]: likes - 1,
          [str3]: 1,
          [str4]: notlikes + 1
        })
      }

    } else if (islike == 0 && isnotlike == 1) {
      if (type == 'agree') {
        console.log(3)
        request({
          url: "api/qa/likesReply?id=" + id, 
          method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
        }).then(res =>{
          console.log(res);
          Toast(res.data.msg)
        })
        let str1 = "answerList[" + index + "].islike";
        let str2 = "answerList[" + index + "].likes";
        let str3 = "answerList[" + index + "].isnotlike";
        let str4 = "answerList[" + index + "].notlikes";
        this.setData({ 
          [str1]: 1,
          [str2]: likes + 1 ,
          [str3]: 0,
          [str4]: notlikes - 1
        })
      } else{
        console.log(4)
        request({
          url: "api/qa/notlikesReply?id=" + id, 
          method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
        }).then(res =>{
          console.log(res);
          if (res.data.code == 200) {
            let str1 = "answerList[" + index + "].isnotlike";
            let str2 = "answerList[" + index + "].notlikes";
            this.setData({ 
              [str1]: 1,
              [str2]: notlikes + 1,
            })
          } else if (res.data.code == 300) {
            let str1 = "answerList[" + index + "].isnotlike";
            let str2 = "answerList[" + index + "].notlikes";
            this.setData({ 
              [str1]: 0,
              [str2]: notlikes - 1,
            })
          }
          Toast(res.data.msg);
        })
      }
    }
  },
  // 点赞相关
  agreeTap(){
    let id = this.data.content.question_id;
    let likes = this.data.content.likes;
    request({
      url: "api/qa/likes?id=" + id, 
      method: 'GET', header: {'cookie':wx.getStorageSync('sessionid')}
    }).then(res =>{
      console.log(res)
      if (res.data.code == 200) {
        let str1 = "content.islike";
        let str2 = "content.likes";
        this.setData({ 
          [str1]: 1,
          [str2]: likes + 1
        })
      } else if (res.data.code == 300) {
        let str1 = "content.islike";
        let str2 = "content.likes";
        this.setData({ 
          [str1]: 0,
          [str2]: likes - 1
        })
      }
      Toast(res.data.msg)
    })
  },
  // 自我点赞
  selfAgree(){
    Toast('不能给自己点赞/踩哦');
  },
  onTopClose() {
    this.setData({ topActionShow: false });
  },
  onMidClose() {
    this.setData({  midActionShow: false });
  },
  onBtmClose() {
    this.setData({ 
      btmActionShow: false,
      selectId: null
    });
  },
  // 问答详情按钮
  onTopSelect(event) {
    let that = this;
    let name = event.detail.name;
    let content = this.data.content;
    if(name == '举报'){
      wx.showModal({
        title: '提示',
        content: '确定要举报这个问题吗？',
        success (res) {
          if (res.confirm) {
            request({
              url: "api/qa/reportQuestion?id=" + content.question_id, 
              method: 'GET',header: {'cookie':wx.getStorageSync('sessionid')}
            }).then(res =>{
              console.log(res)
              if(res.data.code == 200){
                Toast('举报成功，感谢您的反馈')
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }

        },
        complete () {
          that.setData({ topActionShow: false })
        }
      })
    }
  },
  // 我的评论按钮
  onMidSelect(event) {
    let that = this;
    let name = event.detail.name;
    let content = this.data.content;
    let id = this.data.selectId;
    console.log(id)
    if (name == '删除') {
      wx.showModal({
        title: '提示',
        content: '确定要删除这条回答吗',
        success (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            request({
              url: "api/qa/delete?id=" + id, 
              method: 'GET',header: {'cookie':wx.getStorageSync('sessionid')}
            }).then(res =>{
              console.log(res.data)
              if(res.data.code == 200){
                request({
                  url: "api/qa/question?id=" + content.question_id + "&have=-1", 
                  method: 'GET',header: {'cookie':wx.getStorageSync('sessionid')}
                }).then(res =>{
                  console.log(res.data);
                  let selfList = res.data;
                  for(let i=0;i<selfList.length;i++){
                    let content = myBase64.decode(selfList[i].content);
                    let openname = myBase64.decode(selfList[i].openname);
                        selfList[i].content = content;
                        selfList[i].openname = openname;
                  }
                  that.setData({
                    selfList: selfList
                  })
                })
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        },
        complete () {
          that.setData({ midActionShow: false})
        }
      })
    }
  },
  // 全部评论按钮
  onBtmSelect(event) {
    let that = this;
    let name = event.detail.name;
    let id = this.data.selectId;
    if (name == '举报') {
      wx.showModal({
        title: '提示',
        content: '确定要举报这个回答吗？',
        success (res) {
          if (res.confirm) {
            request({
              url: "api/qa/report?id=" + id, 
              method: 'GET',header: {'cookie':wx.getStorageSync('sessionid')}
            }).then(res =>{
              console.log(res)
              if(res.data.code == 200){
                Toast('举报成功，感谢您的反馈')
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        },
        complete () {
          that.setData({ btmActionShow: false})
        }
      })
    }
  },
  // 展示分享
  showShare(){
    this.setData({ showShare: true });
  },
  // 关闭分享
  onShareClose() {
    this.setData({ showShare: false });
  },
  // 分享选择
  onShareSelect(event) {
    let name = event.detail.name;
    if (name == '复制链接') {
      wx.setClipboardData({
        data: '#小程序://一目校园/一目校园/QjaJ59zOxdja9Ct',
        success(){
          wx.showModal({title: '将链接复制在微信中发送给小伙伴就能打开啦'})
        }
      })
    }
    this.onShareClose();
  },
  // 查看大图
  checkImg(e){
    let imgUrl = this.data.imgUrl;
    let id = parseInt(e.currentTarget.dataset.id);
    console.log(e)
    console.log(imgUrl[id])
    wx.previewImage({
      urls: imgUrl, //需要预览的图片http链接列表，注意是数组
      current: imgUrl[id], // 当前显示图片的http链接，默认是第一个
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  // 列表下拉相关
  pullUpLoad(){
    let that = this;
    let QAEnd = that.data.QAEnd;
    let content = that.data.content;
    if (!QAEnd) {
      let answerList= that.data.answerList;
      that.setData({ QALoading: true })
      request({
        url: "api/qa/question?id=" + content.question_id + "&have=" + answerList.length, 
        method: 'GET',header: {'cookie':wx.getStorageSync('sessionid')}
      }).then(res =>{
        console.log(res.data);
        let arr = res.data;
        let userid = wx.getStorageSync('accountInfo').userid;
        for(let i=0;i<arr.length;i++){
          if (arr[i].userid == userid) {
            arr.splice(i, 1)
          } else {
            let content = myBase64.decode(arr[i].content);
            let openname = myBase64.decode(arr[i].openname);
            arr[i].content = content;
            arr[i].openname = openname;
            arr[i].show = true;
          }
        }
        let newArr = answerList.concat(arr);
        // console.log(newArr);
        this.setData({
          QALoading: false,
          answerList: newArr
        })
        if (res.data.length > 0) {
          Notify({
            message: '获取到 ' + res.data.length + ' 条回答',
            type: 'success',
            safeAreaInsetTop: true,
            duration: '600'
          });
        } else{
          Notify({
            message: '没有更多回答了哦',
            type: 'warning',
            safeAreaInsetTop: true,
            duration: '600'
          });
          that.setData({
            QAEnd: true
          })
        }
      })
    } else{
      Notify({
        message: '没有更多问答了哦',
        type: 'warning',
        safeAreaInsetTop: true,
        duration: '600'
      });
    }
  },
  // 返回上一级
  BackPage() {
    let backHome = this.data.backHome;
    if(backHome){ wx.navigateTo({ url: '/pages/blank/blank' })
    } else{ wx.navigateBack({ delta: 1 }); }
  },
  // 分享相关
  onShareAppMessage(res){
    let content = this.data.content;
    this.setData({
      topActionShow: false,
      midActionShow: false,
      btmActionShow: false
    })
    return {
      title: '这里有个有意思的问答，一起来看看吧',
      path: '/pages/QAPost/QAPost?from=share&content=' + encodeURIComponent(JSON.stringify(content)),
    }
  }
})