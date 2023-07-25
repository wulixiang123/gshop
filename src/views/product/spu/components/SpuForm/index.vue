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
        <el-table-column label="属性名" width="200" prop="saleAttrName"></el-table-column>
        <el-table-column label="属性值名称列表">
          <template #default="{row,$index}">
            <el-tag
            v-for="(tag,idx) in row.spuSaleAttrValueList"
            :key="idx"
            class="mr-10"
            closable
            :disable-transitions="false"
            @close="handleClose(row.spuSaleAttrValueList,idx)"
            >{{ tag.saleAttrValueName }}
            </el-tag>

            <el-input
            v-if="row.inputVisible"
            ref="InputRef"
            v-model.trim="row.inputValue"
            style="width:100px"
            size="small"
            @keyup.enter="handleInputConfirm(row)"
            @blur="handleInputConfirm(row)"
            ></el-input>
            <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput(row)">新增</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template #default="{row,$index}">
          <el-button type="danger" size="small" :icon="Delete" @click="deleteSaleAttr($index)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSave">保存</el-button>
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
//            3.2.3.1 添加销售属性
//                  1. 此时是无法选中销售属性下拉的,需要v-model绑定一个数据,这里我们使用一个单独的数据对下拉进行收集
//                  2. 点击"添加销售属性"按钮,此时应该在 spuForm.spuSaleAttrList 中多一条数据
//                  3. 表格同时页面中展示这条数据
//                  4. 表格中数据点击删除,要删除一条数据
//                  注意:
//                  当点击添加销售属性之后,表格多一条数据,下拉应该少一条数据
//                  这里采用计算属性去做,只要表格中有这条数据,我们就计算出一个新的数组,新的数组中不包含这条数据即可
//                  拿着这个新的数组在页面中展示
//            3.2.3.2 添加销售属性值
//    3.3 保存
//        组装数据
//            组装category3Id
//            组装spuImageList
//        调用接口,成功之后,切换主列表显示
//        取消保存,目前使用的是v-if展示当前组件,所以不需要清空 spuForm 这个数据
//                 如果使用的是v-show就需要了
// 4. 编辑
//      在主列表点击"编辑"按钮,切换到spuForm组件,回显数据
//      4.1 切换SpuForm组件展示(之前的逻辑就有)
//      4.2 回显数据
//          把SpuList组件点击的一条spu,也就主列表中表格的一行数据,一条row,传给父组件
//          父组件接到SpuList要编辑的row(一条spu数据),再传给SpuForm组件
//          SpuForm组件使用props接收传过来的spuInfo(传过来的一条spu)
//          回显数据,此时传过来的spuInfo中 spuImageList 和 spuSaleAttrList 是null
//            需要单独发请求拿 spuImageList 和 spuSaleAttrList 两个的数据
//            封装api,判断当前的 props.spuInfo.id 是否存在,存在代表编辑,调用接口拿数据
//            接口封装的时候,需要去改TS的类型(小心改错了)
//          注意: 还有个报错,就是因为 props.spuInfo 中的 spuSaleAttrList 是null,而计算属性中用到了spuSaleAttrList.some
//                null.some 报错了
//          注意: 还没有编辑保存呢
// #endregion
import { computed, nextTick, onMounted, ref } from 'vue'
import { ElMessage, type InputInstance, type UploadProps, type UploadUserFile } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import { STATUS } from '../../index.vue'
import trademarkApi, { type TMModel } from '@/api/trademark'
import spuApi, { type SaleAttrModel, type SpuImageModel, type SpuModel, type SpuSaleAttrModel, type SpuSaleAttrValueModel } from '@/api/spu'
import useCategoryStore from '@/stores/category'
import {cloneDeep} from 'lodash'
const categoryStore = useCategoryStore()
const action = `${ import.meta.env.VITE_API_URL }/admin/product/upload`
const emits =  defineEmits<{
  (e: 'update:modelValue', status: number): void
}>()
const props = defineProps<{
  spuInfo:SpuModel
}>()
  const onSave = async() =>{
    // 组装数据
    // 三级分类(保存之前组装)
    spuForm.value.category3Id = categoryStore.category3Id
    let tempSpuImageList = spuImageList.value.map(item=>{
      return{
        imgName:item.name!,
        imgUrl:item.response.data
      }
    })
    spuForm.value.spuImageList = tempSpuImageList

    // 简单校验一下
    let { category3Id, spuName, description, tmId, spuSaleAttrList, spuImageList: siList } = spuForm.value
    if(!(category3Id && spuName && description && tmId && spuSaleAttrList.length && siList.length)){
      ElMessage.warning('请输入完整内容')
      return
    }
    // 删掉多余的销售属性相关数据
    spuForm.value.spuSaleAttrList.forEach(item=>{
      delete item.inputVisible// 控制销售属性值input显示
      delete item.inputValue  // 收集销售属性值input输入
  })

  // 发送请求
  await spuApi.reqSaveSpu(spuForm.value)
  ElMessage.success('保存成功')
  emits('update:modelValue', STATUS.SPULIST) // 切换主列表
  }


  const InputRef = ref<InputInstance>()
  // 点击按钮展示input框
  const showInput = (row:SpuSaleAttrModel)=>{
    row.inputVisible = true// 展示input
    nextTick(()=>{
      InputRef.value?.focus()// 等待DOM跟新完毕之后,拿到input元素,进行自动聚焦
    })
  }
// 添加销售属性值(失焦、回车)
  const handleInputConfirm = (row:SpuSaleAttrModel)=>{
    if(!row.inputValue){  // 做空值校验
      row.inputVisible = false// 展示button
      return
    }

    // 重复校验
    // row.inputValue // 当前输入
    // row.spuSaleAttrValueList // 已存在数组
    // console.log(row.spuSaleAttrValueList.map(item=>item.saleAttrValueName));
    
    if(row.spuSaleAttrValueList.map(item=>item.saleAttrValueName).includes(row.inputValue)){
      ElMessage.error('输入销售属性值重复,请重试')
      row.inputVisible = false// 展示按钮
      row.inputValue = ''// 清空输入内容
      return
    }
    row.spuSaleAttrValueList.push({
      baseSaleAttrId:row.baseSaleAttrId,
      saleAttrValueName:row.inputValue
    })
    row.inputVisible = false// 展示button
    row.inputValue = ''// 清空input框输入的值(一定要清空)
  }

// 删除销售属性值
const handleClose = (spuSaleAttrValueList: SpuSaleAttrValueModel[], idx: number) => {
  spuSaleAttrValueList.splice(idx, 1)
}




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
    // debugger
  }

  // 删除销售属性
  const deleteSaleAttr = (index:number)=>{
    spuForm.value.spuSaleAttrList.splice(index,1)
  }




// 图片上传相关内容 - 不报错,不漂红
const spuImageList = ref<SpuImageModel[]>([])// 收集图片列表
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
  spuImageList.value = uploadFiles as any
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
const saleAttrList = computed(()=>{// 页面中使用的下拉数据
  let newArr = baseSaleAttrList.value.filter(saleAttr=>{// saleAttr --> { id: 1, name: '颜色' }  { id: 2, name: '版本' }  { id: 3, name: '尺码' }
    let isExist = spuForm.value.spuSaleAttrList.some(item=>{
      // item的样子
      // {
      //   "baseSaleAttrId": 1,
      //   "saleAttrName": "颜色",
      //   "spuSaleAttrValueList": []
      // }
      return item.baseSaleAttrId == saleAttr.id
    })
    return !isExist
  })
  return newArr
})


// 编辑获取数据,图片列表
const getSpuImageList = async () =>{
  let result = await spuApi.reqSpuImageListBySpuId(spuForm.value.id!)
  console.log('图片列表',result);
  // 新增的时候使用的是一个单独的变量收集数据的,所以回显的时候也给这个单独的变量
  // 注意: upload组件预览图片必须要 name 属性 和 url 属性
  //      而请求回来的数据没有这两个属性,所以不显示
  spuImageList.value = result.map(item=>{
    return{
      ...item,
      name:item.imgName,
      url:item.imgUrl
    }
  })
}

// 编辑获取数据
const getSpuSaleAttrList = async () => {
  let result = await spuApi.reqSaleAttrListBySpuId(spuForm.value.id!)
  console.log('销售属性',result);
  spuForm.value.spuSaleAttrList = result
}




// 初始化数据展示
onMounted(()=>{
  getTrademarkList()
  getSaleAttrList()
  if(props.spuInfo.id){
    spuForm.value = cloneDeep(props.spuInfo)
    getSpuImageList()
    getSpuSaleAttrList()
  }
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