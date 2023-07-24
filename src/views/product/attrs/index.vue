<template>
  <div class="attrs">
    
    <el-card class="mb-10">
      <CategorySelector :disabled="isEdit"></CategorySelector>
    </el-card>

    <el-card>
      <div v-if="isEdit">
        <el-form inline>
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model.trim="attrsForm.attrName"></el-input>
          </el-form-item>
        </el-form>

        <div class="mb-10">
          <el-button type="primary" @click="addAttrVal" :disabled="!attrsForm.attrName">添加属性值</el-button>
          <el-button @click="onCancel">取消</el-button>
        </div>

        <el-table :data="attrsForm.attrValueList" border class="mb-10">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column label="属性值名称" prop="valueName"></el-table-column>
          <el-table-column label="操作" width="80">
            <template #default="{row,$index}">
              <el-button type="danger" :icon="Delete" size="small"
              @click="deleteAttrValue($index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>

        <div>
          <el-button type="primary" @click="onSave" :disabled="!(attrsForm.attrName && attrsForm.attrValueList.length)">保存</el-button>
          <el-button @click="onCancel">取消</el-button>
        </div>
      </div>

      <!-- 主列表 -->
      <div v-else>
        <el-button type="primary" :icon="Plus" class="mb-10" :disabled="!categoryStore.category3Id" @click="isEdit = true"
        >添加属性</el-button>
        <el-table :data="attrs" border>
          <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
          <el-table-column label="属性名" prop="attrName" width="160"></el-table-column>
          <el-table-column label="属性值列表">
            <template #default="{ row, $index }">
              <el-tag
                class="mr-10"
                type="success"
                v-for="attrVal in row.attrValueList"
                :key="attrVal.id"
              >{{ attrVal.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140">
            <template #default="{ row,$index }">
              <el-button type="warning" :icon="Edit" size="small"></el-button>
              <el-button type="danger" :icon="Delete" size="small"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// #region
// 按道理来说,写页面应该按步骤走,但是整个页面分为了上下两块内容
// 上面的内容是一个三级分类,可以作为一个公用组件来用,所以先写三级分类组件,然后返回再写页面
// 三级分类组件的步骤,详情见组件中
// 1. 静态搭建
// 2. 初始化数据展示
// 3. 交互
//    3.1 新增
//        思路:使用布尔值控制编辑界面的显示,先把静态搭建出来，收集数据,点击保存提交
//        步骤:
//            静态搭建
//            api准备 - 目的:为了知道我们提交给后端需要哪些数据
//            收集数据
//            点击保存,调用api,保存数据
//    3.2 编辑
//    3.3 删除
// #endregion
import attrsApi, { type AttrsModel } from '@/api/attrs'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import useCategoryStore from '@/stores/category'
import { watch, ref } from 'vue';
import { ElMessage } from 'element-plus';
const categoryStore = useCategoryStore()//接收到store中的数据

// 保存
const onSave = async () => {
  // 组装数据
  attrsForm.value.categoryId = categoryStore.category3Id
  // 发送请求
  await attrsApi.reqSaveAttrInfo(attrsForm.value)
  ElMessage.success('保存成功')
  onCancel()// 显示主列表,清空数据
  getList()// 刷新主列表
}

const onCancel = () => {
  isEdit.value = false//显示主列表
  attrsForm.value = initAttrsForm()//清空收集的数据
}

// 添加属性值
const addAttrVal = () => {
  attrsForm.value.attrValueList.push({
    valueName:`哦吼-${Date.now()}`
  })
  console.log(attrsForm.value);
}

// 删除属性值
const deleteAttrValue = (index:number) => {
  attrsForm.value.attrValueList.splice(index,1)
}

// 用一个布尔值控制新增和编辑
const isEdit = ref(false)
const initAttrsForm = () => ({
  attrName: '',
  attrValueList: [],
  // 三级分类id赋值的时机两个: 1.新增页面刚打开的时候赋值 2.保存之前进行赋值(选择)
  categoryId: undefined,
  categoryLevel: 3, // 我们只添加3级的,所以可以写死
})
const attrsForm = ref<AttrsModel>( initAttrsForm() )

// 初始化数据
const attrs = ref<AttrsModel[]>([]) // 存数据
const getList = async () => {
  const { category1Id, category2Id, category3Id } = categoryStore

  let result = await attrsApi.reqAttrsList(category1Id as number, category2Id as number, category3Id as number)

  attrs.value = result
}

watch(() => categoryStore.category3Id, (nval) => {
  if (nval) { // 有数据,发请求
    getList()
  } else { // 没有数据不发请求,清空数据
    attrs.value = []
  }
})



</script>

<style scoped>

</style>