<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <!-- clearable是删除的一个小图标 -->
      <el-input placeholder="SPU名称" clearable v-model="spuForm.spuName"></el-input>
    </el-form-item>

    <el-form-item label="品牌">
      <el-select v-model="spuForm.tmId">
        <el-option
        v-for="tm in tmList"
        :key="tm.id"
        :value="(tm.id as number)" 
        :label="tm.tmName"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="SPU描述">
      <el-input type="textarea" placeholder="SPU描述" rows="3" v-model="spuForm.description"></el-input>
    </el-form-item>

    <el-form-item label="SPU图片">
      <el-upload
      v-model:file-list="(spuImageList as any)"
      :action="action"
      list-type="picture-card"
      :on-success="handleSuccess"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      >
      <el-icon><Plus /></el-icon>
    </el-upload>

    <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" class="img"/>
    </el-dialog>
    </el-form-item>

    <el-form-item label="销售属性">
      <div class="mb-10">
        <el-select :placeholder="`还有${saleAttrList.length}个未选择`" class="mr-10" v-model="attrIdName">
          <el-option
          v-for="saleAttr in baseSaleAttrList"
          :key="saleAttr.id" 
          :value="`${saleAttr.id}:${saleAttr.name}`" 
          :label="saleAttr.name"
          ></el-option>
        </el-select>

        <el-button type="primary" @click="addSaleAttr">添加销售属性</el-button>
      </div>

      <el-table border :data="spuForm.spuSaleAttrList">
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column label="属性名" width="200"></el-table-column>
        <el-table-column label="属性值名称列表"></el-table-column>
        <el-table-column label="操作" width="80">
          <template #default="{row,$index}">
          <el-button type="danger" size="small" :icon="Delete" @click="deleteSaleAttr($index)"></el-button>
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
//        创建一个变量用来收集数据
//        3.2.1 收集普通数据 - 指可以直接使用v-model收集的数据
//        3.2.2 收集图片列表(单独去做)
//              拓展:
//                  let a: number
//                  let b = '我爱你'
//                  a = b as any
//                  当等号两侧的类型不一致的时候,此时可以使用 any 类型进行中转,就可以尽心赋值
//              我们这里使用一个单独的变量 spuImageList对图片列表进行收集
//              收集的数据一定会和我们想要的数据有出入,在保存之前组装数据的时候进行整理
//        3.2.3 收集销售属性(单独去做)
// #endregion
import { computed, onMounted, ref } from 'vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import { STATUS } from '../../index.vue'
import trademarkApi, { type TMModel } from '@/api/trademark'
import spuApi, { type SaleAttrModel, type SpuImageModel } from '@/api/spu'
const action = `${ import.meta.env.VITE_API_URL }/admin/product/upload`
import type { SpuModel } from '@/api/spu'
  const emits =  defineEmits<{
    (e: 'update:modelValue', status: number): void
  }>()


  // 添加销售属性
  const attrIdName = ref('')//手机选中的销售属性下拉  收集到的是option的value属性,长的样子`id:name`
  // 添加销售属性
  const addSaleAttr = () => {
    if(!attrIdName.value){
      return
    }
    const [baseSaleAttrId,saleAttrName] = attrIdName.value.split(':')
    spuForm.value.spuSaleAttrList.push({
      baseSaleAttrId:+baseSaleAttrId,
      saleAttrName,
      spuSaleAttrValueList:[]
    })
    attrIdName.value = ''// 重置收集数据的下拉为空
    debugger
  }

  // 删除销售属性
  const deleteSaleAttr = (index:number)=>{
    spuForm.value.spuSaleAttrList.splice(index,1)
  }




// 图片上传相关内容 - 不报错,不漂红

const spuImageList = ref<SpuImageModel[]>([])// 收集图片列表

const fileList = ref<UploadUserFile[]>([]) // 图片列表
const dialogImageUrl = ref('') // 预览的url
const dialogVisible = ref(false) // 预览的布尔值,控制dialog显示隐藏

// 上传成功的回调
const handleSuccess:UploadProps['onSuccess'] = (
  response, // 后端返回给我们的数据
  uploadFile, // 文件的详细信息,名称,大小都有
  uploadFiles // 文件列表
)=>{
  // console.log(response)
  // console.log(uploadFile)
  // console.log(uploadFiles)
  spuImageList.value = uploadFiles as any
}


// 删除的回调
const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles)
}
// 预览的回调
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}



// 创建数据-用来收集数据
const initSpuForm = (): SpuModel => ({
  category3Id: undefined, // 页面展示的时候,也可以在保存之前赋值
  spuName: '',
  description: '',
  tmId: undefined,
  spuSaleAttrList: [],
  spuImageList: []
})
const spuForm = ref<SpuModel>(initSpuForm())




// 获取品牌下拉
const tmList = ref<TMModel[]>([])
const getTrademarkList = async () => {
  let result = await trademarkApi.reqTrademarkList()
  tmList.value = result
}

// 获取销售属性下拉
const baseSaleAttrList = ref<SaleAttrModel[]>([])
const getSaleAttrList = async () => {
  baseSaleAttrList.value = await spuApi.reqSaleAttrList()
}

// 计算属性 - 过滤表格中存在的销售属性
const saleAttrList = computed(()=>{
  let newArr = baseSaleAttrList.value.filter(saleAttr=>{
    let isExist = spuForm.value.spuSaleAttrList.some(item=>{
      return item.baseSaleAttrId == saleAttr.id
    })
    return !isExist
  })
  return newArr
})

// 初始化数据展示
onMounted(()=>{
  getTrademarkList()
  getSaleAttrList()
})





// -------------------------------
// let a: string | undefined
// let b: string
// b = a!
// ts中的感叹号可以理解为,非空验证

  </script>
  
  <style scoped>
  .img{
    width: 100%;
    height: 100%;
  }
  </style>