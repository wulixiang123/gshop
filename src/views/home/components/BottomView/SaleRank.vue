<template>
    <el-card>
      <template #header>
        <div class="header">
          <div class="title">分类销售排行</div>
          <el-radio-group v-model="radio" size="small">
            <el-radio-button label="品类" />
            <el-radio-button label="商品" />
          </el-radio-group>
        </div>
      </template>
  
      <v-chart class="chart" :option="setOptions()" autoresize></v-chart>
    </el-card>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue'
  import useEchartsStore from '@/stores/echarts'
  const echartsStore = useEchartsStore()
  const radio = ref('品类')
  
  // 原始数据
  const saleRank = computed(() => {
    return echartsStore.echartsData.saleRank
  })
  
  const useData = computed(() => {
  
    // 这里一共解构了两层
    // 对第一层的category和goods进行了第二次解构, 此时是无法访问到 category和goods
    const { category: { axisX: axisX1, data1 }, goods: { axisX: axisX2, data1: data2 } } = saleRank.value
    //                  axisX起别名axisX1               axisX起别名axisX2  data1起别名data2
    
    
    // 品类的总量
    const categoryTotal = data1.reduce((prev, item) => prev + item, 0)
    // 商品的总量
    const goodsTotal = data2.reduce((prev, item) => prev + item, 0)
  
  
    // 品类饼图数据
    const categoryData = axisX1.map((item, index) => {
      return {
        // name: item,
        name: `${ item } | ${ (data1[index] / categoryTotal * 100).toFixed(2) }%`,
        value: data1[index]
      }
    })
    // 商品饼图数据
    const goodsData = axisX2.map((item, index) => {
      return {
        // name: item,
        name: `${ item } | ${ (data2[index] / goodsTotal * 100).toFixed(2) }%`,
        value: data2[index]
      }
    })
    // 现在的数据格式
    // [
    //   { name: '草莓', value: 68 },
    //   ...
    // ]
    // 直接算成
    // [
    //   { name: '草莓 | 22.22%', value: 68 }
    //   ...
    // ]
    // 展示name的时候实在每一项上,咱们有formatter可以给展示的文本进行格式化
  
    return {
      categoryTotal,
      goodsTotal,
      categoryData,
      goodsData,
    }
  })
  
  
  
  
  
  const setOptions = () => ({
    title: [
      {
        text: radio.value == '品类' ? '品类分布' : '商品分布',
        textStyle: {
          fontSize: '14px'
        },
        left: '5px',
        top: '10px'
      },
      {
        textAlign: 'center', // 文本居中
        text: '用户数量',
        textStyle: {
          fontSize: '24px'
        },
        subtext: radio.value == '品类' ? useData.value.categoryTotal : useData.value.goodsTotal,
        subtextStyle: {
          fontSize: '16px'
        },
        left: '36.5%',
        top: '45%'
      }
    ],
    tooltip: {
      trigger: 'item'
    },
    legend: {
      top: 'center',
      right: '2%',
      orient: 'vertical' // 默认'horizontal'水平   'vertical'是垂直
    },
    series: [
      {
        // name: 'Access From',
        name:radio.value == '品类'?'品类分布':'商品分布',// name属性变化图表会重新绘制
        type: 'pie', // bar  line  pie饼图
        radius: ['50%', '70%'], // 内圆和外圆得半径
        // right: '10%',
        center: ['38%', '50%'], // 圆心位置
        avoidLabelOverlap: false, // 不知道, 是否防止标签(指的label文本)重叠,默认是true,是防止的
        itemStyle: { // 每一项的样式
          borderRadius: 10, // 每一项的圆角
          borderColor: '#fff', // 每一项边框颜色
          borderWidth: 2 // 每一项边框的宽度
        },
        label: {
          // show: false,
          show: true,
          // position: 'center',
          formatter: (params: any) => {
            // params.name --->  '草莓 | 22.22%'
            return params.name.split(' | ')[0] // 直接格式化展示的文本
          }
        },
        // emphasis: { // 鼠标移入每一项文本高亮状态
        //   label: {
        //     show: true,
        //     fontSize: 40,
        //     fontWeight: 'bold'
        //   }
        // },
        labelLine: { // label文本到每一项之间的线
          show: true,
          length: 10, // 线的第一段
          length2: 20 // 线的第二段
        },
        data: radio.value == '品类' ? useData.value.categoryData : useData.value.goodsData
        // data: [
        //   { value: 1048, name: 'Search Engine' },
        //   { value: 735, name: 'Direct' },
        //   { value: 580, name: 'Email' },
        //   { value: 484, name: 'Union Ads' },
        //   { value: 300, name: 'Video Ads' }
        // ]
      }
    ]
  })
  
  </script>
  
  <style lang="scss" scoped>
  .header {
    display: flex;
    justify-content: space-between;
  }
  
  .chart {
    height: 387px; 
  }
  </style>