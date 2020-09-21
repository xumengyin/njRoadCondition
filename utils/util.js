
var QQMapWX = require('../lib/qqmap-wx-jssdk.js');
var qqmapsdk;
const mapId='6VBBZ-CM2CU-Q5KV5-BE34A-JU7PK-6LFFV'
const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

//获取定位权限，会申请权限
function isGetLocPermission() {

    return new Promise((resolve, reject) => {
        wx.authorize({
            scope: "scope.userLocation",

            success(res) {
                console.log("loc success----" + res)
                resolve()
            },
            fail() {
                console.log("loc fail----")
                //授权失败
                wx.showModal({
                    title: '提示！',
                    confirmText: '去设置',
                    cancelText: '取消',
                    content: "为了更好的体验小程序,需要您的位置授权",
                    success(res) {
                        if (res.confirm) {
                            wx.openSetting({
                                success(res) {
                                    console.log(res.authSetting)
                                    if (res.authSetting['scope.userLocation']) {
                                        resolve()
                                    } else {
                                        reject()
                                    }
                                },
                            })
                        } else {
                            reject()
                        }
                    },
                    fail(res) {

                    }
                })
            }

        })
    })

}


function getCity(lat,lng) {
    qqmapsdk = new QQMapWX({
        key: mapId
    });
    return new Promise((resolve, reject)=>{
        qqmapsdk.reverseGeocoder({
            location:{latitude:lat,longitude:lng},
            success:function (res) {
                if(res.status==0)
                {
                    resolve(res)
                }else
                {
                    reject(res)
                }
            },
            fail:function (err) {
                reject(err)
            }
        })
    })

}
function post(url, params, showLoad = false, callback) {
    wx.request({
        url: url,
        data: params,
        method: "POST",
        success(res) {
            callback.success(res)
        },
        fail(res) {
            callback.fail(res)
        },
        complete(res) {
            callback.complete(res)
        }
    })
}

function get(url, params, showLoad = false) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: url,
            data: params,
            method: "GET",
            success(res) {
                resolve(res)
            },
            fail(res) {
                reject(res)
            },
            complete(res) {
                // callback.complete(res)
            }
        })
    })

}

function uuid() {
    let s = [];
    let hexDigits = "0123456789abcdef";
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    let uuid = s.join("");
    return uuid;
}

function isEmpty(str) {
    if (str == undefined || str == "" || str == null || str == "undefined") {
        return true;
    }
    return false;
}

//百度坐标转高德（传入经度、纬度）
function bd_decrypt(bd_lng, bd_lat) {
    var X_PI = Math.PI * 3000.0 / 180.0;
    var x = bd_lng - 0.0065;
    var y = bd_lat - 0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * X_PI);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * X_PI);
    var gg_lng = z * Math.cos(theta);
    var gg_lat = z * Math.sin(theta);
    return {lng: gg_lng, lat: gg_lat}
}

//高德坐标转百度（传入经度、纬度）
function bd_encrypt(gg_lng, gg_lat) {
    var X_PI = Math.PI * 3000.0 / 180.0;
    var x = gg_lng, y = gg_lat;
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * X_PI);
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * X_PI);
    var bd_lng = z * Math.cos(theta) + 0.0065;
    var bd_lat = z * Math.sin(theta) + 0.006;
    return {
        bd_lat: bd_lat,
        bd_lng: bd_lng
    };
}

function showToast(msg) {
    wx.showToast({
        icon: "none",
        title: msg,
    })
}

function getMycollect() {
    return new Promise((resolve, reject) => {
        wx.getStorage({
            key: "collect",
            success(res) {
                resolve(res)
            },
            fail(res) {
                console.log("xuxu fail",res)
            }
        })
    })

}

function setCollect(data) {
    let datas = getApp().globalData.collectData
    let hadOwn = datas.some((res) => {
        return res.CameraId == data.CameraId
    })
    if (!hadOwn) {
        datas.push(data)
      let save={data:datas}
        wx.setStorage({
            key: "collect",
            data: JSON.stringify(save),
            fail(res) {
                datas.splice(datas.length - 1, 1)
                showToast("收藏失败,稍后再试")
            }
        })
    }
}

module.exports = {
    formatTime: formatTime,
    isGetLocPermission,
    get, post, uuid, isEmpty, bd_decrypt, bd_encrypt, showToast
    , getMycollect, setCollect,mapId,getCity
}
