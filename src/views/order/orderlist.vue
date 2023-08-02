<template>
<div class="order-list">
    <div class="card operate mb-10">
        <el-button class="mb-5" type="primary" size="small">签收</el-button>
        <el-button class="mb-5" type="primary" size="small">批量签收</el-button>
        <el-button class="mb-5" type="primary" size="small">审单</el-button>
        <el-button class="mb-5" type="primary" size="small">批量审单</el-button>
        <el-button class="mb-5" type="primary" size="small">拆单</el-button>
        <el-button class="mb-5" type="primary" size="small">合单</el-button>
        <el-button class="mb-5" type="primary" size="small">锁单</el-button>
        <el-button class="mb-5" type="primary" size="small">解锁</el-button>
        <el-button class="mb-5" type="primary" size="small">改地址</el-button>
        <el-button class="mb-5" type="primary" size="small">批量改地址</el-button>
        <el-button class="mb-5" type="primary" size="small">改快递</el-button>
        <el-button class="mb-5" type="primary" size="small">批量改快递</el-button>
        <el-button class="mb-5" type="primary" size="small">冻结订单</el-button>
        <el-button class="mb-5" type="primary" size="small">异常订单处理</el-button>
        <el-button class="mb-5" type="primary" size="small">批量异常订单处理</el-button>
    </div>

    <!-- 搜索区域 -->
    <div class="card search-area">
        <el-form inline class="search-form">
            <el-form-item label="订单号">
                <el-input size="small" placeholder="请输入订单号" clearable></el-input>
            </el-form-item>
            <el-form-item label="交易编号">
                <el-input size="small" placeholder="请输入交易编号" clearable></el-input>
            </el-form-item>
            <el-form-item label="收货人">
                <el-input size="small" placeholder="请输入收货人" clearable></el-input>
            </el-form-item>
            <el-form-item label="收货人电话">
                <el-input size="small" placeholder="请输入收货人电话" clearable></el-input>
            </el-form-item>
            <el-form-item label="收货地址">
                <el-input size="small" placeholder="收货地址" clearable></el-input>
            </el-form-item>
            <el-form-item label="订单状态">
                <el-select size="small" placeholder="请选择">
                    <el-option lable="北京" value="1"></el-option>
                    <el-option lable="北京" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="创建开始时间">
                <el-date-picker size="small" type="datetime" placeholder="创建时间" />
            </el-form-item>
            <el-form-item label="创建结束时间">
                <el-date-picker size="small" type="datetime" placeholder="过期时间" />
            </el-form-item>
        </el-form>
        <div class="search-operate">
            <el-button type="primary" size="small" :icon="RefreshRight"></el-button>
            <el-button type="primary" size="small" :icon="Search"></el-button>
            <el-button type="primary" size="small" :icon="Sort"></el-button>
        </div>
    </div>
</div>
</template>

<script setup lang="ts">
import {RefreshRight,Search,Sort} from '@element-plus/icons-vue'
</script>

<style scoped lang="scss">
.order-list{
    .card{
        padding: 20px;
        background-color: #fff;
    }
    .search-area{
        position: relative;
        .search-form{
            .el-form-item{
                margin-right: 10px;
                margin-bottom: 3px;
            }
            &::after{
                content: '';
                display: inline-block;
                width: 200px;
                height: 22px;
            }
        }
        .search-operate{
            position: absolute;
            right: 20px;
            bottom: 28px;
        }
    }
}
</style>