<template>
  <div>
    <el-table border :data="skuList">
      <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
      <el-table-column label="名称" prop="skuName"></el-table-column>
      <el-table-column label="描述" prop="skuDesc"></el-table-column>
      <el-table-column label="默认图片">
        <template #default="{row,$index}">
          <img :src="row.skuDefaultImg" style="width: 100px;height: 60px;">
        </template>
      </el-table-column>
      <el-table-column label="重量(KG)" prop="weight"></el-table-column>
      <el-table-column label="价格(元)" prop="price"></el-table-column>
      <el-table-column label="操作" align="center" width="250">
        <template #default="{row,$index}">
          <el-button v-if="row.isSale" type="success" size="small" icon="ele-Top" title="下架" @click="cancelSale(row)"></el-button>
          <el-button v-else type="success" size="small" icon="ele-Top" title="上架" @click="onSale(row)"></el-button>
          <el-button type="primary" size="small" icon="ele-Edit" title="修改"></el-button>
          <el-button type="info" size="small" icon="ele-InfoFilled" title="查看详情"></el-button>
          <el-button type="danger" size="small" icon="ele-Delete" title="删除sku"></el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-pagination v-model:currentPage="page" v-model:page-size="limit" layout="prev, pager, next, jumper"
      :total="total" @current-change="getSkuList" />


  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import skuApi, { type skuInfoDate } from '@/api/sku'

const page = ref(1)
const limit = ref(10)
const total = ref(0)
const skuList = ref<skuInfoDate[]>([])
const isShowSkuInfo = ref(false)
const skuInfo = ref<skuInfoDate>({
  price: 0,
  skuName: '',
  skuDesc: '',
  weight: '',
  skuDefaultImg: '',
  skuImageList: [],
  skuAttrValueList: [],
  skuSaleAttrValueList: []
})
onMounted(()=>{
  getSkuList()
})


// 上架
const cancelSale = async(row:skuInfoDate) => {
  await skuApi.cancelSale(row.id as number)
  getSkuList()
}
// 下架
const onSale = async(row:skuInfoDate)=>{
  await skuApi.onSale(row.id as number)
}



const getSkuList = async(pager = 1) => {
  page.value = pager
  const result = await skuApi.reqSkuList(page.value,limit.value)
  console.log(result);
  skuList.value = result.records
  total.value = result.total
}
</script>

<style scoped>

</style>