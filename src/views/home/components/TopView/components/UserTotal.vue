<template>
    <CommonCard title="累计用户数" :count="1177885">
      <template #main>
        <v-chart :option="setOptions()" autoresize></v-chart>
      </template>
      <template #bottom>
        <div class="btm">
          <div class="content">
            <span class="mr-5">日同比</span>
            <span class="mr-5">17.71</span>
            <span class="icon up"></span>
          </div>
          <div class="content">
            <span class="mr-5">月同比</span>
            <span class="mr-5">-47.12</span>
            <span class="icon down"></span>
          </div>
        </div>
      </template>
    </CommonCard>
  </template>
  
  <script setup lang="ts">
  import CommonCard from '../components/CommonCard/index.vue'
  import { computed } from 'vue'
  import useEchartsStore from '@/stores/echarts';
  const echartsStore = useEchartsStore()
  
  const usersTotal = computed(() => {
    return echartsStore.echartsData.usersTotal
  })
  const usersLastDay = computed(() => {
    return echartsStore.echartsData.usersLastDay
  })
  const usersLastMonth = computed(() => {
    return echartsStore.echartsData.usersLastMonth
  })
  const userGrowthLastDay = computed(() => {
    return echartsStore.echartsData.userGrowthLastDay
  })
  const userGrowthLastMonth = computed(() => {
    return echartsStore.echartsData.userGrowthLastMonth
  })
  
  const setOptions = () => ({
    tooltip: {
      // trigger: 'item', // 默认是 'item触发'
      trigger: 'axis' // 轴线触发
    },
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    xAxis: {
      show: false,
      // type: 'category', // x轴默认类型是类目轴 category, 改为数值轴 'value'
      // data: [] // 放数据,放类目的数据(这个data是跟着类目轴走)
      type: 'value',
      max: usersTotal.value
    },
    yAxis: {
      show: false,
      type: 'category', // 默认是 value 数值轴,改为category 类目轴
      data: ['用户增长量']
    },
    series: [
      {
        name: '累计用户数',
        type: 'bar',
        barWidth: '30%',
        data: [usersTotal.value - usersLastMonth.value], // 数据
        showBackground: true, // 展示柱状图背景
        itemStyle: {
          color: 'red'
        },
        label: {
          show: true, // 展示文本
          color: 'red',
          formatter: () => { // 参数可以拿到需要格式化的文本,我们不用,所以没写
            return '|'
          },
          position: 'right', // 文本的位置
          distance: 50, // 文本距离元素的间距
        }
      }
    ]
  })
  
  </script>
  
  <style lang="scss" scoped>
  .btm {
    display: flex;
    justify-content: space-between;
    .content {
      display: flex;
      align-items: center;
    }
  }
  
  // 箭头
  .down {
    margin-top: 5px;
    display: inline-block;
    border: 5px solid blue;
    border-left-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
  }
  .up {
    margin-top: -5px;
    display: inline-block;
    border: 5px solid red;
    border-left-color: transparent;
    border-right-color: transparent;
    border-top-color: transparent;
  }
  </style>