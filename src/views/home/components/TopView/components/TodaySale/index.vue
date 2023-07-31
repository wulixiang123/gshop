<template>
  <CommonCard title="今日销售额" :count="salesToday">
    <template #main>
      <div class="main">
        <div class="content">
          <span class="mr-5">同日比</span>
          <span class="mr-5">{{ salesGrowthLastDay  }}</span>
          <span class="icon down"></span>
        </div>
        <div class="content">
          <span class="mr-5">月同比</span>
          <span class="mr-5">{{salesGrowthLastMonth}} </span>
          <span class="icon up"></span>
        </div>
      </div>
    </template>
    <template #bottom>
      <span class="mr-10">昨日销售额</span>
      <span>{{ salesLastDay }}</span>
    </template>
  </CommonCard>
</template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import CommonCard from '../CommonCard/index.vue'
  import useEchartsStore from '@/stores/echarts';
  const echartsStore = useEchartsStore()
  const salesToday = computed(()=>{
    return echartsStore.echartsData.salesLastDay
  })
  const salesLastDay = computed(()=>{
    return echartsStore.echartsData.salesLastDay
  })
  const salesGrowthLastDay = computed(()=>{
    return echartsStore.echartsData.salesGrowthLastDay
  })
  const salesGrowthLastMonth = computed(()=>{
    return echartsStore.echartsData.salesGrowthLastMonth
  })
  </script>
  
  <style lang="scss" scoped>

  .main {
    height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .content {
      color: #999;
      font-size: 12px;
      font-weight: bold;
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