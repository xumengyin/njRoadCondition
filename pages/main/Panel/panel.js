// pages/main/Panel/panel.js
import {setCollect} from "../../../utils/util";

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        listData: Object,
        show: Number,
        markerIndex: Number
    },

    observers: {

        listData: function (e) {
            let data=getApp().getCollectData()
            let isCollected=data.some((item)=>{
                return e.CameraId==item.CameraId
            })
            this.setData({
                item: e,
                isCollected
            })
        },
        show: function (event) {
            if (event == 1) {
                this.shows()
            } else {
                this.close()
            }
        }
    },
    /**
     * 组件的初始数据
     */
    data: {
        item: {},
        showSwiper: false,
        currentIndex: 0,
        isCollected:false
    },

    /**
     * 组件的方法列表
     */
    methods: {
        close() {
            this.setData({
                showSwiper: false
            })
        },
        shows() {
            this.setData({
                showSwiper: true
            })
        },
        collect() {
            if(this.data.isCollected)
                return
            setCollect(this.data.item)
            this.triggerEvent("collect", this.data.item)
            this.setData({
                isCollected:true
            })
        },
        playVideo() {
            let item = this.data.item;
            this.triggerEvent("play", item)
        },
        catchMove() {

        }
    }
})
