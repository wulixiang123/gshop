<template>
<v-chart class="chart" :option="setOptions(activeIndex)"></v-chart>
</template>

<script setup lang="ts">
import useEchartsStore from '@/stores/echarts';
import { computed } from 'vue';
const echartsStore = useEchartsStore()
const props = defineProps<{
    activeIndex:string
}>()

const orderFullYearAxis = computed(()=>{
    return echartsStore.echartsData.orderFullYearAxis
})
const orderFullYear = computed(()=>{
    return echartsStore.echartsData.orderFullYear
})
const userFullYearAxis = computed(()=>{
    return echartsStore.echartsData.userFullYearAxis
})
const userFullYear = computed(()=>{
    return echartsStore.echartsData.userFullYear
})


const setOptions = (activeIndex:string)=>{
    return{
        title:{
            text:activeIndex == '1'?'销售趋势':'访问趋势',
            textStyle:{
                fontSize:14
            },
            top:10
        },
        grid:{
            left:40,
            right:20,
            top:50,
            bottom:40
        },
        tooltip:{
            trigger:'axis'
        },
        xAxis:{
            data:orderFullYearAxis.value
        },
        yAxis:{},
        series:[
            {
                name:activeIndex == '1'?'销售趋势':'访问趋势',
                type:'bar',
                barWidth:'30%',
                data:activeIndex == '1'?orderFullYear.value:userFullYear.value
            }
        ]
    }
}
</script>

<style scoped>
.chart{
    width: 100%;
    height: 300px;
}
</style>