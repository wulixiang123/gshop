<template>
  <div class="attrs">
    
    <el-card class="mb-10">
      <!-- :disabled 显示与隐藏 -->
      <CategorySelector :disabled="isEdit"></CategorySelector>
    </el-card>

    <el-card>
      <!-- 新增/编辑 -->
      <div v-if="isEdit">
        <el-form inline><!-- inline 变成行内 -->
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model.trim="attrsForm.attrName"></el-input>
          </el-form-item>
        </el-form>

        <div class="mb-10">
                                                          <!-- 有值取反是false  disabled是false的时候是不显示的 -->
          <el-button type="primary" @click="addAttrVal" :disabled="!attrsForm.attrName" >添加属性值</el-button>
          <el-button @click="onCancel">取消</el-button>
        </div>

        <el-table :data="attrsForm.attrValueList" border class="mb-10">
          <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
          <el-table-column label="属性值名称">
            <template #default="{row,$index}"><!-- row是每一行的数据 $index用来获取当前循环的索引 -->
              <!--
                这里不能用一个布尔值控制input的显示和隐藏,应该是每一行单独去控制input的显示和隐藏
                下面的size="small" 是设置表单组件的尺寸的
                @blur="hideInput(row,$index)"
              -->
              <el-input
              v-if="row.inputVisible"
              v-model.trim="row.valueName"
              size="small"
              @blur="hideInput(row,$index)"
              ref="inputRef"
              ></el-input>
              <div
              v-else
              @click="showInput(row)"
              >{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80">
            <template #default="{row,$index}">
              <el-button type="danger" :icon="Delete" size="small"
              @click="deleteAttrValue($index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>

        <div>
          <!-- 有任何一方没有值都为false -->
          <el-button type="primary" @click="onSave" :disabled="!(attrsForm.attrName && attrsForm.attrValueList.length)">保存</el-button>
          <el-button @click="onCancel">取消</el-button>
        </div>
      </div>

      <!-- 主列表 -->
      <div v-else>
              <!-- 加上disabled属性  disabled== true  :disabled="true" 
              不加disabled属性 disabled== false :disabled="false"
        -->
        <!-- 
          input undefined   false  true ==disabled
          input 123         true    false == disabled
         -->
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
              <el-button type="warning" :icon="Edit" size="small" @click="editAttr(row)" title="编辑"></el-button>

              <el-popconfirm :title="`确认要删除[${ row.attrName }]吗?`" @confirm="deleteAttr(row)">
                <template #reference>
                  <el-button type="danger" :icon="Delete" size="small" title="删除"></el-button>
                </template>
              </el-popconfirm>
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
//    3.2 给所有的按钮加限制条件
//        3.2.1 主列表 - 添加属性按钮,只有在三级分类id有值的情况下才能点击
//              :disabled="!categoryStore.category3Id"
//        3.2.2 编辑界面 - 三级分类是禁用状态
//              <CategorySelector :disabled="isEdit"></CategorySelector>
//              disabled 组件内部需要接一下才能用
//        3.2.3 添加属性值 按钮
//              属性名有值才能点击"添加属性值"按钮
//              :disabled="!attrsForm.attrName">添加属性值</el-button>
//        3.2.4 新增保存
//              必须属性名有值且属性值列表有值才能保存
//              <el-button :disabled="!(attrsForm.attrName && attrsForm.attrValueList.length)">保存</el-button>
//    3.3 编辑
//        点击"编辑"按钮,切换界面显示,回显数据
//        当再次点击"保存"提交保存即可
//    3.4 删除
//        注意: 双重校验
//    3.5 编辑界面属性值表格中,属性值切换input
//        3.5.1 先写 input 框已存在的数据进行编辑
//          表格展示的数据是 attrsForm.attrValueList,展示的是属性值列表
//            每一行是一个row,都是一个属性值对象
//            每个row添加一个inputVisible(布尔值)来控制input框的显示和隐藏(每一行单独框)
//            当点击"div"的时候,将当前row的inputVisible切换成true,展示input
//            当input框失焦的时候,将当前row的inputVisible切换成false展示div
//          此时已经把input的切换做完了,这里还有一个功能
//          "自动聚焦"这个动能也许做,当input展示的时候,此时需要在input框中进行自动聚焦
//            只有拿到input这个元素之后,才能让它聚焦,拿到元素通过ref拿即可
//            注意: DOM更新显示input框是异步的,所有用nextTick
//        3.5.2 再写新增一个属性值的时候展示逻辑
//        注意:
//            当input框进行失焦的时候
//                  没有内容,此时应该把这条数据干掉 
//                  当有重复的时候也应该改掉这条数据
// #endregion
import attrsApi, { type AttrsModel } from '@/api/attrs'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import useCategoryStore from '@/stores/category'
import { watch, ref, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import { cloneDeep } from 'lodash'
import type { AttrsValueModel } from '@/api/attrs';

const categoryStore = useCategoryStore()//接收到store中的数据


// 获取当前展示的input元素
const inputRef = ref<HTMLInputElement>()
// 展示input
const showInput = (row:AttrsValueModel)=>{
  row.inputVisible = true//展示当前行的input
  // DOM更新显示input框是异步的,所以用nextTick
  nextTick(() => {
    inputRef.value?.focus()//设置焦点
  })
}

// 隐藏input
const hideInput = (row:AttrsValueModel,$index:number) => {
  row.inputVisible = false// 隐藏当前行的input
  if(!row.valueName){// 对输入的值进行非空校验
    attrsForm.value.attrValueList.splice($index,1)// 删除表格为空的数据
    return
  }
  // $index是回调传参传过来的,是当前我们自己正在切换的row
  // idx是循环 attrsForm.attrValueList 这个数组的下标
  // 因为 row 一定在 attrsForm.attrValueList 这个数组中存在
  // 此时当下标相等的时候,就是自己和自己对比,自己和自己一定是相等的,所以需要把自己排除掉
  let isRepeat = attrsForm.value.attrValueList.some((item,idx)=>{
    if($index == idx)return// 把自己排除掉
    else{return row.valueName == item.valueName}
  })
  if(isRepeat){
    ElMessage.error('输入的值不能重复,请重试')
    attrsForm.value.attrValueList.splice($index,1)
    // return
  }
}



// 删除
const deleteAttr = async (row: AttrsModel) => {
await attrsApi.reqDeleteAttr(row.id as number)
ElMessage.success('删除成功') // 给提示
getList() // 重新获取列表数据
}


// 编辑
const editAttr = (row:AttrsModel) => {
  isEdit.value = true// 切换编辑界面
  attrsForm.value = cloneDeep(row)// 回显数据 其实就是使用深拷贝还原原来的row
}


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
  isEdit.value = false//隐藏主列表
  attrsForm.value = initAttrsForm()//清空收集的数据
}

// 添加属性值
const addAttrVal = () => {
  attrsForm.value.attrValueList.push({
    valueName:'',
    inputVisible:true// 展示添加新数据的input框
  })
    // DOM更新是异步的 这里的代码是等待DOM加载完毕后执行
    nextTick(() => {
    inputRef.value?.focus()//设置焦点
  })
}

// 删除属性值
const deleteAttrValue = (index:number) => {
  attrsForm.value.attrValueList.splice(index,1)//splice 按照下标 删除1个
}

// 用一个布尔值控制新增和编辑
const isEdit = ref(false)//默认不展示

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
  // debugger
  let result = await attrsApi.reqAttrsList(category1Id as number, category2Id as number, category3Id as number)
  // debugger
  attrs.value = result//将数据存入attrs中
}

watch(() => categoryStore.category3Id, (nval) => {
  if (nval) { // 有数据,发请求
    getList()
  } else { 
    attrs.value = []// 没有数据不发请求,清空数据
  }
},{immediate:true})//立即执行
</script>

<style scoped>

</style>