import { defineStore } from 'pinia'
import echartsApi, { type EchartsModel } from '@/api/echarts'

const initEchartsData = (): EchartsModel => ({
  "//1": "今日销售额",
  "salesToday": 0,
  "salesLastDay":   0,
  "salesGrowthLastDay": 0,
  "salesGrowthLastMonth": 0,

  "//2": "今日订单量",
  "orderToday": 0,
  "orderLastDay": 0,
  "orderTrend": [],
  "orderTrendAxis": [],
  
  "//3": "今日交易用户数",
  "orderUser": 0,
  "returnRate": 0,
  "orderUserTrend": [],
  "orderUserTrendAxis": [],
  
  "//4": "累计用户数",
  "usersTotal": 0,
  "usersLastDay": 0,
  "usersLastMonth": 0,
  "userGrowthLastDay": "",
  "userGrowthLastMonth": "",
  
  
  "//5": "销售额与访问量",
  "orderFullYearAxis": [],
  "orderFullYear": [],
  "userFullYearAxis": [],
  "userFullYear": [],
  
  "//6": "排行榜",
  "orderRank": [],
  "userRank": [],

  "//7": "关键字搜索",
  "searchWord": [],

  "//8": "分类销售排行",
  "saleRank": {
    "category": {
      "axisX": [],
      "data1": []
    },
    "goods": {
      "axisX": [],
      "data1": []
    }
  }
})

const useEchartsStore = defineStore('echartsStore', {
  state: () => ({
    echartsData: initEchartsData()
  }),
  actions: {
    async getEchartsData() {
      let result = await echartsApi.reqEchartsData()
      this.echartsData = result
    }
  },
  getters: {}
})

export default useEchartsStore