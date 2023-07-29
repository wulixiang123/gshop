import Mock from 'mockjs'
import echartsData  from './echarts.json'

Mock.mock('/mock/getEchartsData',()=>{
    return {
        code:200,
        data:echartsData,
        message:'success'
    }
})