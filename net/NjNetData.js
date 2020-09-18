import {NetData} from "./NetData";
import {get,uuid} from "../utils/util";

export class NjNetData extends NetData {
    constructor() {
        super();
        this.ip = this.getIpNum() + "." + this.getIpNum() + "." + this.getIpNum() + "." + this.getIpNum()
        this.uuid=uuid()
    }
    getRootUrl() {
        return "https://m.mynj.cn:11156/roadcondition_client/login/"
    }

    getIpNum() {
        return parseInt((Math.random() * 255) + "")
    }

    getAllCamera(params = {}) {

        //let allParam = Object.assign({clientIp: this.ip}, params)
        let allParam = {clientIp: this.ip}
        return new Promise((resolve, reject) => {
            get(this.getRootUrl() + "getAllCamera", allParam).then((res)=>{
                resolve(res.data)
            },(err)=>{
                reject(err)
            })
        })
    }


    getCameraDetail(params) {
        let {cameraid,cameraname}=params
        let allParam={clientIp: this.ip,cameraid,cameraname,userId:this.uuid}
        return new Promise((resolve, reject) => {
            get(this.getRootUrl() + "getVideo", allParam).then((res)=>{
                resolve(res.data)
            },(err)=>{
                reject(err)
            })
        })
    }

}