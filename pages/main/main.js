// pages/main/main.js
import {isGetLocPermission, isEmpty, bd_decrypt, showToast, getCity} from "../../utils/util";
import {NjNetData} from "../../net/NjNetData";

let dataHelp=new NjNetData()
let lastIndex=-1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lat:32.0417315172,
    lng:118.7841367722,
    cameraMarkers:[],
    allDatas:[],
    showPlayer:0,
    showPanel:0,
    playSrc:'',
    markerIndex:-1,
    curData:{},
    chooseAllShow:false,
    collectShow:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that =this
    isGetLocPermission().then((res)=>{
      wx.getLocation({
        type: "gcj02",
        success: (res) => {
          const { latitude, longitude } = res
          this.setData({
            lat: latitude,
            lng: longitude,
          })
          getCity(latitude,longitude).then((res)=>{
                let city=res.result.ad_info.city
                console.log("xuxu","city"+city)
                if(isEmpty(city)||!city.startsWith("南京"))
                {
                      wx.showModal({
                          title:"提示",
                          content:"目前暂时只支持南京查询实时路况摄像!",
                          showCancel:false,
                        success(res) {
                          that.setData({
                            lat:32.0417315172,
                            lng:118.7841367722,
                          })
                        }
                      })
                }
          },(err)=>{

          })
        },
        fail: (resp) => {
          // this.setData({
          //   lat: 32.0417315172,
          //   lng: 118.7841367722,
          // })
        }
      })

    },(err)=>{
      //默认
      // this.setData({
      //   lat:32.043799,
      //   lng:118.784751,
      // })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAllCamera()
  },
  markerTab(e)
  {
      let {markerId} =e.detail
      let curData=undefined
    if (this.data.allDatas.length > markerId) {
      curData=this.data.allDatas[markerId]
    }
    if(curData!=undefined)
    {
      this.showBottomPanel(curData)

    }
  },
  allPanelClick(e)
  {
     this.showBottomPanel(e.detail)
  },
  showBottomPanel(curData)
  {
    if(curData.numIndx>0)
    {
        let {markerIndex,cameraMarkers,allDatas}=this.data
        cameraMarkers[curData.numIndx].iconPath='/images/live_choose.png'
        cameraMarkers[curData.numIndx].width=30
        cameraMarkers[curData.numIndx].height=30
        if(markerIndex>0)
        {
          if(markerIndex<cameraMarkers.length)
          {
            //更换marker 图标
            cameraMarkers[markerIndex].iconPath=allDatas[markerIndex].HlsStatus==1?'/images/live_s1.png':'/images/live_s2.png'
            cameraMarkers[markerIndex].width=28
            cameraMarkers[markerIndex].height=28
          }
        }
      this.setData({
        cameraMarkers
      })
    }
    this.setData({
      lat:curData.lat,
      lng:curData.lng,
      markerIndex:curData.numIndx,
      showPanel:1,
      curData
    })
  },
  collectItem()
  {
    let panel=this.selectComponent("#myCollect")
    console.log("xuxu",panel)
    panel.initData()
  },
  myCollect()
  {
    //我的收藏
    this.setData({
      collectShow:true
    })
  },
  chooseAll()
  {
    this.setData({
      chooseAllShow:true
    })
  },
  play(e)
  {
    console.log("xuxu",e)
    let curData=e.detail
    if(curData.HlsStatus==1)
    {
      this.getCameraDetail(curData.CameraId,curData.Camera_name)
    }else
    {
      showToast("设备离线或者故障，视频无法播放")
    }
    //this.getCameraDetail(curData.CameraId,curData.Camera_name)
  },

  getCameraDetail(id,name)
  {

    dataHelp.getCameraDetail(
        {cameraid:id,cameraname:name}
    ).then((res)=>{
          //播放
      if(isEmpty(res.HlsUri))
      {
        showToast("获取数据错误")
        return
      }
      this.setData({
        showPlayer:1,
        playSrc:res.HlsUri

      })
    },(err)=>{
      showToast("获取数据失败")
    })
  },
  getAllCamera()
  {
    dataHelp.getAllCamera().then((res)=>{
        console.log("xu",res)
      let {allData}=res.retObj
      let filterData=[]
      let markers=[]
      let numIndx=0
      allData.forEach((item,index)=>{
          if(!isEmpty(item.Latitude)&&!isEmpty(item.Longitude))
          {

            let lnglat=bd_decrypt(item.Longitude,item.Latitude)
            item.lat=lnglat.lat
            item.lng=lnglat.lng
            item.numIndx=numIndx
            filterData.push(item)
            markers.push({
              id: numIndx,
              latitude: lnglat.lat,
              longitude: lnglat.lng,
              iconPath: item.HlsStatus==1?'/images/live_s1.png':'/images/live_s2.png',
              width: 28,
              height: 28,
            })
            numIndx++
          }
      })
      this.setData({
        cameraMarkers:markers,
        allDatas:filterData
      })

    },(err)=>{

    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
      return {
        title:"南京城区实时路况摄像直播,快来看看吧!",
        path:"/pages/main/main"
      }
  },
  test()
  {
    console.log("xuxu","test")
  }
})