<template>
  <el-card>
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
          <el-button v-if="row.isSale" type="success" size="small" icon="ele-Top" @click="cancelSale(row)" title="下架"></el-button>
          <el-button v-else type="info" size="small" icon="ele-Bottom" @click="onSale(row)" title="上架"></el-button>
          <el-button type="primary" size="small" icon="ele-Edit" title="修改" @click="updateSku(row)"></el-button>
          <el-button type="info" size="small" icon="ele-InfoFilled" title="查看详情" @click="showSkuInfo(row)"></el-button>
          

              <el-popconfirm :title="`确定要删除${row.skuName}吗?`">
                <template #reference>
                  <el-button type="danger" size="small" icon="ele-Delete" title="删除sku" @click="deleteSku(row)"></el-button>
                </template>
              </el-popconfirm>


              <!-- <el-drawer v-model="isShowSkuInfo" title="I am the title" :with-header="false">
                <span>Hi there!</span>
              </el-drawer> -->



              <!-- <el-drawer v-model="isShowSkuInfo" title="我是菜鸡我是菜鸡">
                <div>
                  <el-drawer>
                    <h1>名称</h1>
                  </el-drawer>
                </div>
              </el-drawer> -->

              <!-- <el-drawer
                v-model="isShowSkuInfo"
                title="我是菜鸡,菜鸡是我"
                direction="rtl"
                size="50%"
              >
                <el-table :data="skuList">
                  <el-table-column prop="skuName" label="名称" width="150" />
                  <el-table-column prop="skuDesc" label="描述" width="200" />
                  <el-table-column prop="price" label="价格" />
                  <el-table-column prop="createTime" label="上架时间" />
                  <el-table-column prop="" label="商品图片">
                    <template #default="{row,$index}">
                      <img :src="row.skuDefaultImg" style="width: 100px;height: 60px;">
                    </template>
                  </el-table-column>
                </el-table>
                <el-pagination v-model:currentPage="page" v-model:page-size="limit" layout="prev, pager, next, jumper"
                  :total="total" @current-change="getSkuList" />
              </el-drawer> -->
        </template>
      </el-table-column>
    </el-table>




    <el-drawer v-model="isShowSkuInfo" :with-header="false" size="50%">
      <el-row class="mb-20">
        <el-col :span="5"><h3>名称:</h3></el-col>
        <el-col :span="16">{{ skuInfo?.skuName }}</el-col>
      </el-row>
      <el-row class="mb-20">
        <el-col :span="5"><h3>描述:</h3></el-col>
        <el-col :span="16">{{ skuInfo?.skuDesc }}</el-col>
      </el-row>
      <el-row class="mb-20">
        <el-col :span="5"><h3>价格:</h3></el-col>
        <el-col :span="16">{{ skuInfo?.price }}</el-col>
      </el-row>

      <el-row class="mb-20">
        <el-col :span="5"><h3>平台属性:</h3></el-col>
        <el-col :span="18">
          <div v-if="skuInfo?.skuAttrValueList && skuInfo?.skuAttrValueList.length > 0">
            <el-tag type="success" style="margin-right: 5px" v-for="value in skuInfo?.skuAttrValueList" :key="value.id">
              {{ value.attrName + '-' + value.valueName }}
            </el-tag>
          </div>
          <div v-else>无</div>
        </el-col>
      </el-row>

      <el-row class="mb-20">
        <el-col :span="5"><h3>销售属性:</h3></el-col>
        <el-col :span="18">
          <!-- <div v-if="skuInfo.skuSaleAttrValueList && skuInfo.skuSaleAttrValueList.length > 0"> -->
          <el-tag type="success" style="margin-right: 5px" v-for="value in skuInfo.skuSaleAttrValueList"
            :key="value.id">
            {{ value.saleAttrName + '-' + value.saleAttrValueName }}
          </el-tag>
          <!-- </div> -->
          <!-- <div v-else>无</div> -->
        </el-col>
      </el-row>

      <el-row class="mb-20">
        <el-col :span="5"><h3>商品图片:</h3></el-col>
        <el-col :span="16">
          <el-carousel class="sku-carousel" trigger="click" height="400px" style="width: 400px">
            <el-carousel-item v-for="item in skuInfo?.skuImageList" :key="item.id">
              <el-image :src="item.imgUrl" style="width: 100%;height: 100%;"></el-image>
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
      
    </el-drawer>

    <el-pagination v-model:currentPage="page" v-model:page-size="limit" layout="prev, pager, next, jumper" :total="total" @current-change="getSkuList" />
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import skuApi, { type skuInfoDate } from '@/api/sku'
import { ElMessage } from 'element-plus';


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




// 查看详情
const showSkuInfo = async(row:skuInfoDate) => {
  isShowSkuInfo.value = true
  skuInfo.value = await skuApi.getSkuInfo(row.id as number)
}





// 删除
const deleteSku = async(row:skuInfoDate) => {
  await skuApi.deleteSku(row.id as number)
  getSkuList()
}







// 编辑
const updateSku = (row: skuInfoDate) => {
  ElMessage.success('正在开发中！！！！')
}



// 上架
const cancelSale = async(row:skuInfoDate) => {
  try {
    await skuApi.cancelSale(row.id as number)
    getSkuList()
    ElMessage.success('下架成功')
  } catch (error) {
    ElMessage.error('下架失败')
  }
}
// 下架
const onSale = async(row:skuInfoDate)=>{
  try {
    await skuApi.onSale(row.id as number)
    getSkuList()
    ElMessage.success('上架成功')
  } catch (error) {
    ElMessage.error('上架失败')
  }
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
body {
  margin: 0;
}
.example-showcase .el-loading-mask {
  z-index: 9;
}
</style>


<style lang="scss">
.el-carousel__button{
  width: 15px;
  height: 15px;
  background-color: rgb(51, 246, 201);
  border-radius: 50%;
}</style>