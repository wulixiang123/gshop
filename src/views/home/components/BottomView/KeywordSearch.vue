<template>
    <el-card class="keyword-search">
      <template #header>
        关键词搜索
      </template>
      
      <el-row :gutter="10" class="mb-5">
        <el-col :span="12">
          <div class="title">搜索用户数</div>
          <div class="count">{{ searchUserTotal }}</div>
          <v-chart class="chart" :option="setOptions(1)" autoresize></v-chart>
        </el-col>
        <el-col :span="12">
          <div class="title">搜索量</div>
          <div class="count">{{ searchCountTotal }}</div>
          <v-chart class="chart" :option="setOptions(2)" autoresize></v-chart>
        </el-col>
      </el-row>
  
      <el-table :data="tableData" class="mb-10" style="height: 240px;">
        <el-table-column type="index" label="排名" align="center" width="60"></el-table-column>
        <el-table-column prop="word" label="关键字" align="center"></el-table-column>
        <el-table-column prop="count" label="搜索数量" align="center"></el-table-column>
        <el-table-column prop="user" label="搜索用户数" align="center"></el-table-column>
        <el-table-column prop="percent" label="搜索占比" align="center"></el-table-column>
      </el-table>
  
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="limit"
        :total="total"
        layout="prev, pager, next"
      ></el-pagination>
    </el-card>
  </template>
  
  <script setup lang="ts">
  import { computed, ref } from 'vue'
  import useEchartsStore from '@/stores/echarts'
  const echartsStore = useEchartsStore()
  
  // 原始数据
  const searchWord = computed(() => {
    return echartsStore.echartsData.searchWord
  })
  
  // -------------------表格数据-----------------
  // 搜索用户数
  const searchUserTotal = computed(() => {
    return searchWord.value.reduce((prev, item) => {
      return prev + item.user
    }, 0)
  })
  // 搜索量
  const searchCountTotal = computed(() => {
    return searchWord.value.reduce((prev, item) => {
      return prev + item.count
    }, 0)
  })
  // 计算表格数据
  const tableData = computed(() => {
  
    let data = searchWord.value.map(item => {
      return {
        ...item,
        percent: (item.user / searchUserTotal.value * 100).toFixed(2) + '%'
      }
    })
  
    total.value = data.length // 总条数
  
    //  当前页 page    展示的数据是               注意: 每页条数是5
    //       1             0   -    4 (包含4)
    //       2             5   -    9 (包含9)
    //       3             10  -   14 (包含14)
    //       4             15  -   19 (包含19)
    //       n         (n-1)*5 -   n*5 (不包含n*5)
    return data.slice( (page.value - 1) * limit.value,  page.value * limit.value  )
  })
  const page = ref(1)
  const limit = ref(5)
  const total = ref(0)
  
  
  // -------------------图表数据-----------------
  // x轴数据
  const xAxisData = computed(() => {
    return searchWord.value.map(item => item.word)
  })
  // y轴 - 搜索量
  const yAxisCountData = computed(() => {
    return searchWord.value.map(item => item.count)
  })
  // y轴 - 搜索用户数
  const yAxisUserData = computed(() => {
    return searchWord.value.map(item => item.user)
  })
  
  // 图表配置项
  const setOptions = (type: number) => ({
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    tooltip: {
      trigger: 'axis' // 轴线触发
    },
    xAxis: {
      show: false,
      data: xAxisData.value
    },
    yAxis: {
      show: false
    },
    series: [
      {
        name: type == 1 ? '搜索用户数' : '搜索量',
        type: 'line',
        smooth: true, // 平滑曲线
        data: type == 1 ? yAxisUserData.value : yAxisCountData.value,
        itemStyle: {
          opacity: 0
        },
        lineStyle: {
          color: 'hotpink'
        },
        areaStyle: {
          color: 'skyblue'
        }
      }
    ]
  })
  
  </script>
  
  <style lang="scss" scoped>
  .keyword-search {
    .title {
      font-size: 14px;
      color: #999;
      margin-bottom: 3px;
    }
    .count {
      font-size: 22px;
      letter-spacing: 1px;
      margin-bottom: 5px;
    }
    .chart {
      height: 50px;
    }
  }
  </style>