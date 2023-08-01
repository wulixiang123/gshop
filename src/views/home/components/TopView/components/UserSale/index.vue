<template>
<CommonCard title="交易用户数" :count="orderUser">
    <template #main>
        <v-chart :option="setOptions()" autoresize></v-chart>
    </template>
    <template #bottom>
        <span class="mr-10">退货率</span>
        <span>{{ returnRate }}</span>
    </template>
</CommonCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CommonCard from '../CommonCard/index.vue'
import useEchartsStore from '@/stores/echarts'
const echartsStore = useEchartsStore()

const orderUser = computed(()=>{
    return echartsStore.echartsData.orderUser
})

const returnRate = computed(()=>{
    return echartsStore.echartsData.returnRate
})

const orderUserTrend = computed(()=>{
    return echartsStore.echartsData.orderUserTrend
})

const orderUserTrendAxis = computed(()=>{
    return echartsStore.echartsData.orderUserTrendAxis
})


const setOptions = () => ({
    tooltip:{},
    grid:{
        left:0,
        top:0,
        right:0,
        bottom:0
    },
    xAxis:{
        show:false,
        data:orderUserTrendAxis.value
    },
    yAxis:{
        show:false
    },
    series:[
        {
            name:'交易用户数',
            type:'bar',
            barWidth:'60%',
            data:orderUserTrend.value
        }
    ]
})
</script>

<style scoped>

</style>