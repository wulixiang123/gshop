<template>
<div class="right-view">
    <div class="title">{{ activeIndex == '1'?'销售属性':'访问排名' }}</div>

    <div
    class="wrapper"
    v-for="item in activeIndex == '1' ? orderRank:userRank"
    :key="item.no"
    >
    <div class="idx" :class="{
        active:item.no <= 3
    }">{{ item.no }}</div>
    <div class="content">{{ item.name }}</div>
    <div class="count">{{ item.count }}</div>
</div>
</div>
</template>

<script setup lang="ts">
import useEchartsStore from '@/stores/echarts';
import { computed } from 'vue';
const echartsStore = useEchartsStore()
const props = defineProps<{
    activeIndex:string
}>()

const orderRank = computed(()=>{
    return echartsStore.echartsData.orderRank
})
const userRank = computed(()=>{
    return echartsStore.echartsData.userRank
})
</script>

<style scoped lang="scss">
.right-view{
    padding: 30px 0 20px;
    .title{
        font-size: 16px;
        margin-bottom: 10px;
    }
    .wrapper{
        display: flex;
        align-items: center;
        line-height: 20px;
        font-size: 12px;
        padding: 5px 0;
        .idx{
            width: 20px;
            height: 20px;
            text-align: center;
            margin-right: 5px;
            border-radius: 50%;
            &.active{
                background: #333;
                color: #fff;
            }
        }
        .content{
            flex: 1;
        }
    }
}
</style>