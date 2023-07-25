<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input placeholder="SPU名称" clearable></el-input>
    </el-form-item>

    <el-form-item label="品牌">
      <el-select>
        <el-option
        v-for="tm in tmList"
        :key="tm.id"
        :value="(tm.id as number)" 
        :label="tm.tmName"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="SPU描述">
      <el-input type="textarea" placeholder="SPU描述" rows="3"></el-input>
    </el-form-item>

    <el-form-item label="SPU图片">
      <el-upload
      v-model:file-list="fileList"
      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      >
      <el-icon><Plus /></el-icon>
    </el-upload>

    <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
    </el-form-item>

    <el-form-item label="销售属性">
      <div class="mb-10">
        <el-select placeholder="还有3个未选择" class="mr-10">
          <el-option
          v-for="saleAttr in baseSaleAttrList"
          :key="saleAttr.id" 
          :value="saleAttr.id" 
          :label="saleAttr.name"
          
          ></el-option>
        </el-select>
        <el-button type="primary">添加销售属性</el-button>
      </div>

      <el-table border>
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column label="属性名" width="200"></el-table-column>
        <el-table-column label="属性值名称列表"></el-table-column>
        <el-table-column label="操作" width="80">
          <template #default="{row,$index}">
          <el-button type="danger" size="small" :icon="Delete"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item>
      <el-button type="primary">保存</el-button>
      <el-button @click="emits('update:modelValue', STATUS.SPULIST)">取消</el-button>
    </el-form-item>
  </el-form>
</template>
  
  <script setup lang="ts">
  // #region
// 1. 静态搭建
// 2. 初始化数据展示
//    api准备
//    初始化页面(mounted)调用接口,获取数据,进行展示
// 3. 交互
//    最终要收集到表单中的数据,点击保存,调用后端api传给后端数据
//    3.1 准备保存api,知道我们要收集哪些数据
//    3.2 收集数据
// #endregion
import { onMounted, ref } from 'vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import { STATUS } from '../../index.vue'
import trademarkApi, { type TMModel } from '@/api/trademark'
import spuApi, { type SaleAtTrModel } from '@/api/spu'
  const emits =  defineEmits<{
    (e: 'update:modelValue', status: number): void
  }>()

  // 图片上传相关内容 - 不报错,不漂红
const fileList = ref<UploadUserFile[]>([]) // 图片列表
const dialogImageUrl = ref('') // 预览的url
const dialogVisible = ref(false) // 预览的布尔值,控制dialog显示隐藏\
// 删除的回调
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}
// 预览的回调
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}


// 获取品牌下拉
const tmList = ref<TMModel[]>([])
const getTrademarkList = async () => {
  let result = await trademarkApi.reqTrademarkList()
  tmList.value = result
}

// 获取销售属性下拉
const baseSaleAttrList = ref<SaleAtTrModel[]>([])
const getSaleAttrList = async () => {
  baseSaleAttrList.value = await spuApi.reqSaleAttrList()
}

// 初始化数据展示
onMounted(()=>{
  getTrademarkList()
  getSaleAttrList()
})
  </script>
  
  <style scoped>
  
  </style>