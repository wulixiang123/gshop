<template>
<el-card>
    <template #header>
        <div class="header">
            <div class="title">分类销售排行</div>
            <el-radio-group v-model="radio" size="small">
                <el-radio-button label="品类"></el-radio-button>
                <el-radio-button label="商品"></el-radio-button>
            </el-radio-group>
        </div>
    </template>

    <v-chart class="chart" :option="setOptions()" autoresize></v-chart>
</el-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const radio = ref('品类')

const setOptions = () => ({
  title: [
    {
      text: '品类分布',
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
      subtext: '406',
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
      name: 'Access From',
      type: 'pie', // bar  line  pie饼图
      radius: ['50%', '70%'], // 内圆和外圆得半径
      // right: '10%',
      center: ['38%', '50%'], // 圆心位置
      avoidLabelOverlap: false, // 不知道
      itemStyle: { // 每一项的样式
        borderRadius: 10, // 每一项的圆角
        borderColor: '#fff', // 每一项边框颜色
        borderWidth: 2 // 每一项边框的宽度
      },
      label: {
        // show: false,
        show: true,
        // position: 'center'
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
      data: [
        { value: 1048, name: 'Search Engine' },
        { value: 735, name: 'Direct' },
        { value: 580, name: 'Email' },
        { value: 484, name: 'Union Ads' },
        { value: 300, name: 'Video Ads' }
      ]
    }
  ]
})
</script>

<style scoped lang="scss">
.chart{
    height: 387px;
}
.header{
    display: flex;
    justify-content: space-between;
}
</style>