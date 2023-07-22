<template>
  <el-card class="box-card">
    <template #header>
        <el-button type="primary" :icon="Plus" @click="addTrademark">添加</el-button>
    </template>
    <!-- 
      当 el-table 元素中注入 data 对象数组后，
      在 el-table-column 中用 prop 属性来对应对象中的键名即可填入数据，
      用 label 属性来定义表格的列名。 可以使用 width 属性来定义列宽。
     -->
    <el-table :data="tmList" border class="mb-10">
      <el-table-column  label="序号" type="index" width="80" align="center"/>
      <el-table-column  label="品牌名称" prop="tmName"/>
      <el-table-column  label="品牌LOGO">
        <template #default="{row,$index}">
          <img :src="row.logoUrl" style="width: 60px; height: 60px;" alt="">
        </template>
      </el-table-column>
      <el-table-column  label="操作">
        <template #default="{row,$index}">
          <el-button type="warning" :icon="Edit" @click="editTm(row)">编辑</el-button>
          <el-button type="danger" :icon="Delete" @click="deleteTm(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        v-model:current-page="page"
        v-model:page-size="limit"
        :total="total"
        :page-sizes="[3, 6, 9]"
        layout="prev, pager, next, jumper, ->, sizes ,total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />

      <el-dialog
      v-model="dialogVisible"
      title="添加品牌"
      width="50%"
    >
      
      <el-form label-width="100px" class="cusform" :model="tmData" :rules="rules" ref="(ruleFormRef)">
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
          <el-button @click="onCancel(ruleFormRef)">取消</el-button>
          <el-button type="primary" @click="onSave(ruleFormRef)">
            确认
          </el-button>
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
//          :data="tmList"   表格展示数据,应该是个数组
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
const ruleFormRef = ref<FormInstance>()// 拿el-form的组件实例
const rules = reactive<FormRules<TMModel>>({
  tmName:[
  // 系统规则
  // { required: true, message: '请输入品牌名称', trigger: 'blur' }, // trigger 触发方式 'blur'失焦触发 'change'变化且失焦触发
  //   { min: 2, max: 10, message: '品牌名称为2到10个字符', trigger: 'blur' },
  // 自定义校验规则
  { validator: validateTmName, trigger: 'blur' }
  ],
  logoUrl: [
    { required: true, message: '请上传品牌LOGO', trigger: 'change' },
  ]
})



// 删除
const deleteTm = (row:TMModel) => {
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
    getTMPage()
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

// 保存
const onSave = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (vaild, fields) => { // 参数一vaild布尔值,true代表校验成功  参数二是一个校验字段的信息

    if (vaild) { // 校验通过

      if (tmData.value.id) { // 编辑保存
        await trademarkApi.reqUpdate(tmData.value)
      } else { // 新增保存
        await trademarkApi.reqSave(tmData.value)
      }

      ElMessage.success('保存成功')

      onCancel(formEl)

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
  if(response.code !== 200){
    ElMessage.error('图片上传失败,请重试')
    return
  }
  tmData.value.logoUrl = response.data;//注意,这里要加分号,不然会被解析成函数

  (ruleFormRef.value as FormInstance).validateField('logoUrl') // 让上传图片下面的红字消失
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('图片必须是JPG!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('图片大小不能超过2M!')
    return false
  }
  return true
}



// 翻页相关
const page = ref(1)
const limit = ref(3)
const total = ref(0)
const handleSizeChange = (val: number) => {
  limit.value = val
  getTMPage()
}
const handleCurrentChange = (val: number) => {
  page.value = val
  getTMPage()
}


const tmList = ref<TMModel[]>([])
const getTMPage = async () => {
  try {
    let result = await trademarkApi.reqPage(page.value,limit.value)
    tmList.value = result.records
    total.value = result.total
    console.log(tmList.value);
    
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