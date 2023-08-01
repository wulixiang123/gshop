<template>
    <CommonCard title="今日订单量" :count="orderToday">
      <template #main>
        <div class="charts" ref="chartsRef"></div>
      </template>
      <template #bottom>
        <span class="mr-10">昨日销售额</span>
        <span>{{ orderLastDay }}</span>
      </template>
    </CommonCard>
  </template>
  
  <script setup lang="ts">
  // 引入
  import { $echarts } from '@/plugins/echarts'
  import { computed, onMounted, ref, watch } from 'vue'
  import CommonCard from '../CommonCard/index.vue'
  import useEchartsStore from '@/stores/echarts'
  const echartsStore = useEchartsStore()
  
  
  const orderToday = computed(() => {
    return echartsStore.echartsData.orderToday
  })
  const orderLastDay = computed(() => {
    return echartsStore.echartsData.orderLastDay
  })
  const orderTrend = computed(() => {
    return echartsStore.echartsData.orderTrend
  })
  const orderTrendAxis = computed(() => {
    return echartsStore.echartsData.orderTrendAxis
  })
  
  
  const setOptions = () => ({
    tooltip: {},
    grid: { // 可以理解成外边距
      top: 0,
      left: 0,
      right: 0,
      bottom: 0
    },
    xAxis: {
      data: orderTrendAxis.value,
      show: false //隐藏x轴
    },
    yAxis: {
      show: false // 隐藏y轴
    },
    series: [
      {
        name: '今日订单量',
        type: 'line', // 柱状图
        smooth: true, // 平滑的
        data: orderTrend.value,
        // 每一项的样式
        itemStyle: {
          // color: 'red',
          opacity: 0 // 隐藏线上的每一项小圆点
        },
        // 折线和x轴围起来的区域
        areaStyle: {
          color: 'hotpink'
        },
        // 折线的样式
        lineStyle: {
          // color: 'green',
          opacity: 0
        }
      }
    ]
  })
  
  
  const myCharts = ref() // 存Echarts实例
  const chartsRef = ref() // 获取到echarts容器的DOM
  onMounted(() => {
    myCharts.value = $echarts.init(chartsRef.value) // 第四步
  
    myCharts.value.setOption( setOptions() )
  })
  
  // 问题: 刷新发现页面不显示图表,只要稍许改动保存页面就显示
  //       问题出在数据是异步的
  watch(orderToday, () => {
    myCharts.value.setOption(setOptions())
  })
  
  
  
  
  </script>
  
  <style lang="scss" scoped>
  .charts {
    width: 100%;
    height: 50px;
  }
  </style>