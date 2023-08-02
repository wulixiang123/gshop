import request from '@/utils/request'

export interface PageModel{
    records:OrderModel[],
    total:number,
    size:number,
    current:number,
    searchCount:boolean,
    pages:number,
}



export interface OrderModel{
    "id": number,
    "consignee": string,
    "consigneeTel": string,
    "totalAmount": number,
    "orderStatus": string,
    "userId": number,
    "paymentWay": string,
    "deliveryAddress": string,
    "orderComment": string,
    "outTradeNo": string,
    "tradeBody": string
    "createTime": string
    "operateTime": null,
    "expireTime": string
    "processStatus": string
    "trackingNo": null,
    "parentOrderId": null,
    "imgUrl": null,
    "provinceId": null,
    "activityReduceAmount": null,
    "couponAmount": null,
    "originalTotalAmount": null,
    "feightFee": null,
    "feightFeeReduce": null,
    "refundableTime": null,
    "orderDetailList": GoodsModel[],
    "orderDetailVoList": null,
    "orderStatusName": string,
    "wareId": null,
    "couponInfo": null
}




export interface GoodsModel {
        "id": number,
        "orderId": number,
        "skuId": number,
        "skuName": string,
        "imgUrl": string,
        "orderPrice": number,
        "skuNum": number,
        "createTime": string
        "sourceType": string
        "sourceId": number,
        "splitTotalAmount": number,
        "splitActivityAmount": number,
        "splitCouponAmount": number,
        "refundStatus": string
        "refundStatusString": string
        "hasStock": null,
        "activityRule": null,
        "couponInfoList": null
    }



export default{
    getPage(page:number,limit:number){
        return request.get<any,PageModel>(`/admin/order/${page}/${limit}`)
    }
}