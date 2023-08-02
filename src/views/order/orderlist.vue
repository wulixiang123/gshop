<template>
<div class="order-list" v-loading="isLoading">
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

    <!-- 主表区域 -->
    <div class="card main mb-10">
        <div class="operate">
            <el-tooltip effect="dark" content="打印" placement="top">
                <el-icon><Printer/></el-icon>
            </el-tooltip>
            <el-tooltip effect="dark" content="导出" placement="top">
                <el-icon><DocumentAdd/></el-icon>
            </el-tooltip>
            <el-tooltip effect="dark" content="全屏" placement="top">
                <el-icon><FullScreen/></el-icon>
            </el-tooltip>
            <el-tooltip effect="dark" content="刷新" placement="top">
                <el-icon><Refresh/></el-icon>
            </el-tooltip>
            <el-tooltip effect="dark" content="设置" placement="top">
                <el-icon><Setting/></el-icon>
            </el-tooltip>
        </div>
        <el-table :data="orderList" border size="small" class="maintable mb-10">
            <el-table-column type="selection" width="55" align="center"></el-table-column>
            <el-table-column prop="id" label="订单号" width="100"></el-table-column>
            <el-table-column prop="outTradeNo" label="交易编号" width="200"></el-table-column>
            <el-table-column prop="orderStatusName" label="订单状态" width="100"></el-table-column>
            <el-table-column prop="paymentWay" label="支付方式" width="100"></el-table-column>
            <el-table-column prop="totalAmount" label="金额" width="100"></el-table-column>
            <el-table-column prop="consignee" label="收货人" width="100"></el-table-column>
            <el-table-column prop="consigneeTel" label="收货人电话" width="160"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="160"></el-table-column>
            <el-table-column prop="deliveryAddress" label="收货人地址"></el-table-column>
        </el-table>

        <el-pagination
        v-model:current-page="page"
        v-model:page-size="limit"
        :total="total"
        :page-sizes="[10, 20, 50]"
        layout="prev, pager, next, jumper, ->, sizes ,total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 副表区域 -->
    <el-tabs type="border-card">
        <el-tab-pane label="商品详情">
            <el-table :data="goodsList" border size="small">
                <el-table-column type="index" label="序号" width="55"/>
                <el-table-column prop="skuId" label="商品ID" width="160"/>
                <el-table-column prop="skuName" label="商品名称" width="260"/>
                <el-table-column prop="orderPrice" label="单价" width="100"/>
                <el-table-column prop="skuNum" label="数量" width="100"/>
                <el-table-column prop="splitTotalAmount" label="合计" width="100"/>
                <el-table-column prop="createTime" label="创建时间" width="160"/>
                <el-table-column label="图片" width="160">
                    <template #default="{row,$index}">
                        <el-image :src="row.imgUrl" style="width: 60px;height: 60px;"></el-image>
                    </template>
                </el-table-column>
            </el-table>
        </el-tab-pane>
        <el-tab-pane label="物流信息">无</el-tab-pane>
        <el-tab-pane label="售后信息">无</el-tab-pane>
    </el-tabs>
</div>
</template>

<script setup lang="ts">
import { RefreshRight, Search, Sort, Printer, DocumentAdd, FullScreen, Refresh, Setting } from '@element-plus/icons-vue'
import orderApi,{type OrderModel,type GoodsModel} from '@/api/order'
import { onMounted, ref } from 'vue';


const isLoading = ref(false)
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const orderList = ref<OrderModel[]>([])
const goodsList = ref<GoodsModel[]>([])


const handleSizeChange = (size:number) => {

}
const handleCurrentChange = (page:number) => {

}


const getPage = async() => {
    isLoading.value = true
    try {
        let result = await orderApi.getPage(page.value,limit.value)
        orderList.value = result.records
        total.value = result.total
        goodsList.value = result.records[0].orderDetailList// 副表数据(默认展示主表第一条数据订单的具体商品列表)
        console.log(result);
        
    } finally{
        isLoading.value = false
    }
}

onMounted(()=>{
    getPage()
})
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
    .main {
    .operate {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 5px;
      .el-icon {
        margin-left: 5px;
      }
    }
  }
}
</style>