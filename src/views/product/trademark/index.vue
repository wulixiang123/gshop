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
          <el-button type="warning" :icon="Edit">编辑</el-button>
          <el-button type="danger" :icon="Delete">删除</el-button>
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
      
      <el-form label-width="100px" class="cusform">
        <el-form-item label="品牌名称">
          <el-input placeholder="请输入品牌名称"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO">

          <el-upload
            class="avatar-uploader"
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
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
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>


  </el-card>

</template>

<script setup lang="ts">
// 1. 静态搭建
// 2. 初始化数据展示
// 3. 交互
import trademarkApi, { type TMModel } from '@/api/trademark';
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { ElMessage, type UploadProps } from 'element-plus';
import { onMounted, ref } from 'vue';


// 新增
const dialogVisible = ref(false)
const addTrademark = () => {
  dialogVisible.value = true
} 
// 新增上传飘红
const imageUrl = ref('') // 图片预览url
const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
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