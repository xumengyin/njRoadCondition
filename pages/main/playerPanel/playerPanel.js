// pages/main/playerPanel/playerPanel.js
import {isEmpty,showToast} from "../../../utils/util";
let videoContext
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show:Number,
    srcHls:String
  },

  /**
   * 组件的初始数据
   */
  data: {
    width:700,
    showPanel:false,
    src:"",

  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      videoContext = wx.createVideoContext('videoPlayer')
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  observers:{
    show:function (e) {
        if(e==1)
        {
          this.showP()
        }else
        {
          this.closeP()
        }
    },
    srcHls:function (e) {
      if(isEmpty(e))
        return
      this.setData({
        src:e
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    showP()
    {
      this.setData({
        showPanel:true
      })
    },
    closeP()
    {
      this.setData({
        showPanel:false
      })
    },
    bindloadedmetadata:function (e) {
      let {width, height, duration}=e.detail

      let aspioHeight=height/width*this.data.width
      this.setData({
        height:aspioHeight+'rpx'
      })
    },
    catchTab:function (e) {

    },
    tabClose:function (e) {
      this.closeP()
      videoContext.pause()
      videoContext.stop()
    },
    bindErr:function (e) {
      console.log("xuxu binderror",e)
      videoContext.stop()
      this.triggerEvent("playErr")
      this.closeP()
      showToast('该设备暂时无法播放，请更换设备或者稍后重试');
    }
  }
})
