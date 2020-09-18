// pages/main/CollectPanel/allDataPanel.js
import {getMycollect, isEmpty} from "../../../utils/util";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: Boolean,
  },

  /**
   * 组件的初始数据
   */
  data: {
    list:[],
    showPop: false,
  },
  observers:{
    show: function (e)
    {
      this.setData({
        showPop:e
      })
    },
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      this.initData()
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    closePanel:function (e) {
      this.setData({
        showPop:false
      })
    },
    initData()
    {
      getMycollect().then((res)=>{
        if (!isEmpty(res.data)) {
          let collect=JSON.parse(res.data)
          getApp().globalData.collectData=collect.data
          this.setData({
            list:collect.data
          })
        }
      },(err)=>{
        this.setData({
          list:[]
        })
      })
    },
    onItemClick:function (e) {
      let curItem=e.currentTarget.dataset.item
      console.log("click",curItem)
      this.triggerEvent('onItemClick', curItem, {})
      this.closePanel()
    },
  }
})
