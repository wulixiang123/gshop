<template>
  <el-card class="box-card">
    <template #header>                          <!-- 此回调打开弹框 -->
        <!-- <el-button type="primary" :icon="Plus" @click="addTrademark">添加</el-button> -->
        <el-button v-if="userInfoStore.userInfo.buttons.includes('btn.Trademark.add')" type="primary" :icon="Plus" @click="addTrademark">添加</el-button>
    </template>
    <!-- 
      当 el-table 元素中注入 data 对象数组后，
      在 el-table-column 中用 prop 属性来对应对象中的键名即可填入数据，
      用 label 属性来定义表格的列名。 可以使用 width 属性来定义列宽。
     -->
    <el-table :data="tmList" border class="mb-10">
      <!-- 
        type 属性用于指定列的类型。它可以设置为 index、selection 或 expand。
        其中，index 类型用于显示每行的索引，selection 类型用于显示每行的复选框，
        而 expand 类型用于显示每行的展开图标，单击该图标可展开该行并显示其他详细信息 。
       -->
      <el-table-column  label="序号" type="index" width="80" align="center"/>
      <!-- 
        prop 属性用于指定列数据在数据源中对应的字段名。例如，如果数据源中有一个对象数组，
        其中每个对象都有一个 tmName 属性，则可以将 prop 属性设置为 tmName，以将该列与数据源中的 tmName 属性关联起来。
       -->
      <el-table-column  label="品牌名称" prop="tmName"/>
      <el-table-column  label="品牌LOGO">
        <!-- 这里的插槽是column专属插槽 row是每一行的数据$index是索引 -->
        <template #default="{row,$index}">
          <img :src="row.logoUrl" style="width: 60px; height: 60px;" alt="">
        </template>
      </el-table-column>
      <el-table-column  label="操作">
        <template #default="{row,$index}">
          <!-- 点击编辑触发回调 需要保存之前的内容展示到编辑页面 所以需要用到深度克隆并把row传递下去 -->
          <el-button type="warning" :icon="Edit" @click="editTm(row)">编辑</el-button>
          <!-- 点击删除触发回调 删除数据需要拿到row -->
          <el-button type="danger" :icon="Delete" @click="deleteTm(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 
      v-model:current-page="page"将分页组件的当前页码与父组件中名为 page 的变量进行双向绑定。
     -->
    <el-pagination
        v-model:current-page="page"
        v-model:page-size="limit"
        :total="total"
        :page-sizes="[3, 6, 9]"
        layout="prev, pager, next, jumper, ->, sizes ,total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
     <!-- dialogVisible弹框 -->
      <el-dialog
      v-model="dialogVisible"
      :title="tmData.id ? '编辑品牌' : '添加品牌'"
      width="50%"
      @close="onCancel(ruleFormRef)"
    >
      
      <el-form label-width="100px" class="cusform" :model="tmData" :rules="rules" ref="ruleFormRef">
        <el-form-item label="品牌名称" prop="tmName">
          <el-input placeholder="请输入品牌名称" v-model.trim="tmData.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">
          <!--
            上传流程：
            点击上传upload组件,弹出弹框,选择文件,
            当选择完文件之后,此时就开始上传
            等待上传完毕之后,会拿到后端返回的图片url
            拿到这个url之后,和form表单中的其他字段,组成一条 品牌数据, 点击保存传给后端


            action="http://gmall-h5-api.atguigu.cn/admin/product/upload"
            优点上线不用改
            缺点如果后端服务的地址发生变化,这里需要改

            action="/app-dev/admin/product/upload"
            优点如果后端服务的地址发生变化,这里不需要改,只要改 vite 中 proxy 代理的url即可
            缺点不能写死,上线需要改
          -->
          <el-upload
            class="avatar-uploader"
            :action="action"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmData.logoUrl" :src="tmData.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">
                上传图片必须是jpg且不能大于2M
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
                          <!-- 弹框消失 -->
          <el-button @click="onCancel(ruleFormRef)">取消</el-button>
                                        <!-- 此回调用于保存数据 -->
          <el-button type="primary" @click="onSave(ruleFormRef)">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
// #region
// 1. 静态搭建
// 2. 初始化数据展示
//    api准备(固定搭配 - 写api的时候就写TS类型)
//    页面初始化的调用api,拿数据,展示数据
//    注意:
//      el-table
//          :data="tmList"   表格展示数据,应该是个数组 组件将使用 tmList 变量中的数据来渲染表格。
//          border  边框
//      el-table-column
//          type="index"序号     type="selection"单选框
//          label 表头
//          width 宽度
//          align="center"  列内容居中
//          prop="tmName"   告诉当前列展示的是哪一个字段
//          如果使用插槽,可以从作用域插槽中拿到 row(当前行展示的对象) 和 $index(当前行展示对象的下标)
// 3. 交互
//    3.1 翻页
//        页码改变,组装数据发送请求
//        每页条数改变,组装数据发送请求
//    3.2 新增
//        3.2.1 点击新增按钮弹出弹框
//              弹框中的静态首先需要搭建完
//        3.2.2 收集弹框表单数据
//        3.2.3 点击保存,调用接口存数据
//        3.2.4 点击取消,清空数据
//    3.3 编辑
//    3.4 删除
// #endregion
import trademarkApi, { type TMModel } from '@/api/trademark';
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules, type UploadProps } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { cloneDeep } from 'lodash'

import { useUserInfoStore } from '@/stores/userInfo'
const userInfoStore = useUserInfoStore()

const action = `${ import.meta.env.VITE_API_URL }/admin/product/upload`

// 自定义某个字段的校验规则
const validateTmName = (rule: any, value: any, callback: any) => {
  // 参数一: 规则
  // 参数二: 值
  // 参数三: callback() 调用代表校验通过
  //          如果传入一个错误,代表校验不通过
  if (!value) {
    callback(new Error('请输入品牌名称'))
  } else if (value.length < 2 || value.length > 10) {
    callback(new Error('品牌长度必须在2到10之间'))
  } else {
    callback()
  }
}

// 表单校验
const ruleFormRef = ref<FormInstance>() // 拿el-form的组件实例
const rules = reactive<FormRules<TMModel>>({
  tmName: [
    // 系统规则
    // { required: true, message: '请输入品牌名称', trigger: 'blur' }, // trigger 触发方式 'blur'失焦触发 'change'变化且失焦触发
    // { min: 2, max: 10, message: '品牌名称为2到10个字符', trigger: 'blur' },
    // 自定义校验规则
    { validator: validateTmName, trigger: 'blur' }//失焦触发
  ],
  logoUrl: [
    { required: true, message: '请上传品牌LOGO', trigger: 'change' },//值变化且失焦才能触发
  ],
})



// 删除
const deleteTm = (row:TMModel) => {
  // 双重校验
  ElMessageBox.confirm(
    `确定要删除${row.tmName}吗?`,
    '警告',
    {
      confirmButtonText:'确认',
      cancelButtonText:'取消',
      type:'warning'
    }
  )
  .then(async () => {
    await trademarkApi.reqDelete(row.id as number)
    ElMessage.success('删除成功')
    getTMPage()//重新渲染数据
  })
}


// 编辑
const editTm = (row: TMModel) => {
  tmData.value = cloneDeep(row) // 回显数据
  dialogVisible.value = true // 弹出弹框
}

// // 保存
// const onSave = async () => {
//   console.log(tmData.value)
//   if(tmData.value.tmName !== '' && tmData.value.logoUrl !== ''){
//     await trademarkApi.reqSave(tmData.value)
//     ElMessage.success('保存成功')
//     onCancel()
//   }else{
//     ElMessage.error('内容或图片未上传!')
//   }
// }



//下面这个是一个 TypeScript 代码片段，定义了一个名为 onSave 的函数。
//该函数接受一个类型为 FormInstance 或 undefined 的 formEl 参数。
//如果 formEl 参数不是 undefined，则该函数将调用 formEl 对象上的 validate 方法。
//validate 方法接受两个参数：第一个参数是一个布尔值，表示校验是否成功；第二个参数是一个包含校验字段信息的对象。
//如果校验成功（即第一个参数为 true），则函数将检查 tmData.value.id 是否存在。
//如果存在，则调用 trademarkApi.reqUpdate(tmData.value) 方法进行编辑保存；
//否则，调用 trademarkApi.reqSave(tmData.value) 方法进行新增保存。
//保存成功后，函数将使用 ElMessage.success('保存成功') 显示一条成功消息，
//并调用 onCancel(formEl) 和 getTMPage() 函数。其中，onCancel(formEl) 函数用于取消弹框，而 getTMPage() 函数用于重新获取数据

// 保存
const onSave = async (formEl: FormInstance | undefined) => {
  // debugger
  if (!formEl) return
  await formEl.validate(async (vaild, fields) => { // 参数一vaild布尔值,true代表校验成功  参数二是一个校验字段的信息
    if (vaild) { // 校验通过
      if (tmData.value.id) { // 编辑保存
        await trademarkApi.reqUpdate(tmData.value)
      } else { // 新增保存
        await trademarkApi.reqSave(tmData.value)
      }
      ElMessage.success('保存成功')
      onCancel(formEl)//取消弹框
      getTMPage() // 重新获取数据
    }
  })
}

// 取消
const onCancel = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  dialogVisible.value = false // 弹框消失
  tmData.value = initTmData() // 初始化收集的表单
  formEl.resetFields() // 重置表单校验
}


// 新增
const initTmData = () => ({
  tmName: '',
  logoUrl: ''
})

let tmData = ref<TMModel>( initTmData() ) // 收集表单数据

const dialogVisible = ref(false)//弹框默认消失
const addTrademark = () => {
  dialogVisible.value = true//打开弹框
}

// 新增上传飘红
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response, // 后端返回给我们的数据
  uploadFile // 文件的详细信息,名称,大小都有
) => {
  if (response.code != 200) {
    ElMessage.error('图片上传失败,请重试')
    return
  }
  tmData.value.logoUrl = response.data;//data就是后端保存的图片地址
  // debugger
  // validateField 方法通常用于验证表单中指定字段的值是否符合预期。在这个例子中，它被用来验证名为 'logoUrl' 的字段
  (ruleFormRef.value as FormInstance).validateField('logoUrl') // 让上传图片下面的红字消失
}

// 这个函数的作用是在上传头像之前对上传的文件进行检查，确保它是 JPG 格式且大小不超过 2M
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('图片必须是JPG!')
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片大小不能超过2M!')
  }
}


// 翻页相关
const page = ref(1)//默认展示第1页
const limit = ref(3)//每页3条
const total = ref(0)//总页
const handleSizeChange = (val: number) => {//每页几条数据
  // limit.value = val//因为有v-model 父或子组件有变化另一方也会变化
  getTMPage()//重新发请求获取数据
}
const handleCurrentChange = (val: number) => {//点击哪页去哪页
  // page.value = val
  getTMPage()//重新发请求获取数据
}

const tmList = ref<TMModel[]>([])//存储的是{id: 1, tmName: '小米', logoUrl: 'http://39.98.123.211/group1/xxx.jpg'}...

// 获取数据
const getTMPage = async () => {
  // debugger
  try {
    let result = await trademarkApi.reqPage(page.value,limit.value)
    tmList.value = result.records//需要渲染的数据
    total.value = result.total//总页
    console.log(tmList.value);//{id: 1, tmName: '小米', logoUrl: 'http://39.98.123.211/group1/M00/03/D9/rBHu8mHmKC6AQ-j2AAAb72A3EO0942.jpg'}
  } catch (error) {
    console.error(error);
  }
}
// 初始化
onMounted(()=>{
  getTMPage()
})
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.cusform {
  width: 70%;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>