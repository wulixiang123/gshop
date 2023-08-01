<template>
    <CommonCard title="今日订单量" :count="orderToday">
        <template #main></template>
        <template #bottom>
            <span class="mb-10">昨日销售额</span>
            <span>{{ orderLastDay }}</span>
        </template>
    </CommonCard>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import CommonCard from '../CommonCard/index.vue'
import useEchartsStore from '@/stores/echarts'
const echartsStore = useEchartsStore()

const orderToday = computed(()=>{
    return echartsStore.echartsData.orderToday
})

const orderLastDay = computed(()=>{
    return echartsStore.echartsData.orderLastDay
})

const orderTrend = computed(()=>{
    return echartsStore.echartsData.orderTrend
}) 

const orderTrendAxis = computed(()=>{
    return echartsStore.echartsData.orderTrendAxis
})
</script>

<style scoped>

</style>