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
                <el-input size="small" v-model="searchForm.id" placeholder="请输入订单号" clearable></el-input>
            </el-form-item>
            <el-form-item label="交易编号">
                <el-input size="small" v-model="searchForm.outTradeNo" placeholder="请输入交易编号" clearable></el-input>
            </el-form-item>
            <el-form-item label="收货人">
                <el-input size="small" v-model="searchForm.consignee" placeholder="请输入收货人" clearable></el-input>
            </el-form-item>
            <el-form-item label="收货人电话">
                <el-input size="small" v-model="searchForm.consigneeTel" placeholder="请输入收货人电话" clearable></el-input>
            </el-form-item>
            <el-form-item label="收货地址">
                <el-input size="small" v-model="searchForm.deliveryAddress" placeholder="收货地址" clearable></el-input>
            </el-form-item>
            <el-form-item label="订单状态">
                <el-select size="small" v-model="searchForm.orderStatus" placeholder="请选择"><!--这个不好使,是个假的-->
                    <el-option label="未支付" value="UNPAID"></el-option>
                    <el-option label="已支付" value="PAID"></el-option>
                    <el-option label="已完成" value="FINISHED"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="创建开始时间">
                <el-date-picker size="small" v-model="searchForm.createTimeBegin" type="datetime" placeholder="创建时间" />
            </el-form-item>
            <el-form-item label="创建结束时间">
                <el-date-picker size="small" v-model="searchForm.createTimeEnd" type="datetime" placeholder="过期时间" />
            </el-form-item>
        </el-form>
        <div class="search-operate">
            <el-button type="primary" size="small" :icon="RefreshRight" @click="resetSearch"></el-button>
            <el-button type="primary" size="small" :icon="Search" @click="onSearch"></el-button>
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
        <el-table
        :data="orderList" 
        border 
        size="small" 
        class="maintable mb-10"
        highlight-current-row
        @row-click="showOrderDetail"
        ref="mainTableRef"
        >
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
        @size-change="getPage"
        @current-change="getPage"
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
import orderApi,{type OrderModel,type GoodsModel,type SearchModel} from '@/api/order'
import { onMounted, ref } from 'vue';
import { cloneDeep } from 'lodash'

// 交互3.2
const showOrderDetail = (row: OrderModel) => {
  goodsList.value = row.orderDetailList
}



// ---------------搜索--------------
// 只有点击搜索按钮,才会把searchForm数据给searchData
const initSearchData = ()=>({
  id: '',
  outTradeNo: '',
  consignee: '',
  consigneeTel: '',
  deliveryAddress: '',
  orderStatus: '',
  createTimeBegin: '',
  createTimeEnd: '',
})


const searchData = ref<SearchModel>(initSearchData())// 发请求携带的参数
const searchForm = ref<SearchModel>(initSearchData())// 页面搜索框收集数据
const resetSearch = () => {
    searchForm.value = initSearchData()
    searchData.value = initSearchData()
    page.value = 1
    limit.value = 10
    getPage()
}
const onSearch = () => {
    searchData.value = cloneDeep(searchForm.value)
    getPage()
}
 



const mainTableRef = ref()
const isLoading = ref(false)
const page = ref(1)
const limit = ref(10)
const total = ref(0)
const orderList = ref<OrderModel[]>([])// 主表数据
const goodsList = ref<GoodsModel[]>([])// 副表数据




const getPage = async() => {
    isLoading.value = true
    try {
        let result = await orderApi.getPage(page.value,limit.value,searchData.value)
        orderList.value = result.records
        total.value = result.total
        // 副表数据(默认展示主表第一条数据订单的具体商品列表)
        goodsList.value = result.records[0].orderDetailList// 副表数据(默认展示主表第一条数据订单的具体商品列表)
        // 设置第一行高亮
        mainTableRef.value.setCurrentRow(result.records[0]) // 参数是row,row是主表的第一行数据
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