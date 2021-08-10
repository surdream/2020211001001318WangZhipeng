export const request = (params) => {

  // 定义公共的  URL
  const host = "https://kb.jswzl.xyz/";
  var baseUrl = "https://kb.jswzl.xyz/";

  return new Promise((resolve, reject) => {
      wx.request({
          ...params,
          url: baseUrl + params.url,
          success: (result) => {
              resolve(result);
          },
          fail: (err) => {
              reject(err);
          }
      });
  })

}