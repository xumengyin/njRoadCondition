// pages/main/CollectPanel/allDataPanel.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: Boolean,
    dataList:Array
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
    dataList:function (e) {
      this.setData({
        list:e
      })
    }
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
    onItemClick:function (e) {
      let curItem=e.currentTarget.dataset.item
      console.log("click",curItem)

      this.triggerEvent('onItemClick', curItem, {})
      this.closePanel()
    },
  }
})
