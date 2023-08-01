<template>
    <el-card class="keyword-search">
        <template #header>
            关键词搜索
        </template>

        <el-row :gutter="10">
            <el-col :span="12">
                <div class="title">搜索用户数</div>
                <div class="count">{{ searchUserTotal }}</div>
                <div class="chart"></div>
            </el-col>
            <el-col :span="12">
                <div class="title">搜索量</div>
                <div class="count">{{ searchCountTotal }}</div>
                <div class="chart"></div>
            </el-col>
        </el-row>

        <el-table :data="tableData" class="mb-10">
            <el-table-column type="index" label="排名" align="center" width="60"></el-table-column>
            <el-table-column prop="word" label="关键字" align="center" width="60"></el-table-column>
            <el-table-column prop="count" label="搜索数量" align="center" width="60"></el-table-column>
            <el-table-column prop="user" label="搜索用户数" align="center" width="60"></el-table-column>
            <el-table-column prop="percent" label="搜索占比" align="center" width="60"></el-table-column>
        </el-table>

        <el-pagination
        v-model:current-page="page"
        v-model:page-size="limit"
        :total="total"
        layout="prev,pager,next"
        ></el-pagination>
    </el-card>
</template>

<script setup lang="ts">
import useEchartsStore from '@/stores/echarts';
import { linkEmits } from 'element-plus';
import { computed, ref } from 'vue';
const echartsStore = useEchartsStore()

const searchWord = computed(()=>{
    return echartsStore.echartsData.searchWord
})

const searchUserTotal = computed(()=>{
    return searchWord.value.reduce((prev,item)=>{
        return prev + item.count
    },0)
})

const searchCountTotal = computed(()=>{
    return searchWord.value.reduce((prev,item)=>{
        return prev + item.count
    },0)
})

const tableData = computed(()=>{
    let data = searchWord.value.map(item=>{
        return{
            ...item,
            percent:(item.user/searchUserTotal.value * 100).toFixed(2) + '%'
        }
    })
    total.value = data.length
    return data.slice((page.value - 1)*limit.value,page.value * limit.value)
})

const page = ref(1)
const limit = ref(5)
const total = ref(0)
</script>

<style scoped lang="scss">
.keyword-search{
    .title{
        font-size: 14px;
        color:#999;
        margin-bottom: 3px;
    }
    .count{
        font-size: 22px;
        letter-spacing: 1px;
    }
    .chart{
        height: 50px;
    }
}
</style>