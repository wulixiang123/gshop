<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <div>xxx</div>
    </el-form-item>

    <el-form-item label="SKU名称">
      <el-input placeholder="SUK名称"></el-input>
    </el-form-item>

    <el-form-item label="价格(元)">
      <el-input placeholder="价格(元)"></el-input>
    </el-form-item>

    <el-form-item label="重量(千克)">
      <el-input placeholder="重量(千克)"></el-input>
    </el-form-item>

    <el-form-item label="规格描述">
      <el-input type="textarea" placeholder="规格描述"></el-input>
    </el-form-item>

    <el-form-item label="平台属性">
      <el-form inline>
        <el-form-item label="手机系统">
          <el-select>
            <el-option :value="1001" label="北京"></el-option>
            <el-option :value="1002" label="上海"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="电池容量">
          <el-select>
            <el-option :value="1001" label="北京"></el-option>
            <el-option :value="1002" label="上海"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="销售属性">
      <el-form inline>
    <el-form-item label="颜色">
      <el-select>
        <el-option :value="1001" label="北京"></el-option>
        <el-option :value="1002" label="上海"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="版本">
      <el-select>
        <el-option :value="1001" label="北京"></el-option>
        <el-option :value="1002" label="上海"></el-option>
      </el-select>
    </el-form-item>
  </el-form>
</el-form-item>

<el-form-item label="图片列表">
  <el-table border>
    <el-table-column type="selection" width="80" align="center"></el-table-column>
    <el-table-column label="图片"></el-table-column>
    <el-table-column label="名称"></el-table-column>
    <el-table-column label="操作" width="100">
      <template #default="{ row, $index }">
        <el-button type="primary" size="small">设为默认</el-button>
      </template>
    </el-table-column>
  </el-table>
</el-form-item>


<el-form-item>
  <el-button type="primary">保存</el-button>
  <el-button>取消</el-button>
</el-form-item>
  </el-form>    
</template>
  
  <script setup lang="ts">
  import { STATUS } from '../../index.vue'
  const emits =  defineEmits<{
    (e: 'update:modelValue', status: number): void
  }>()
  </script>
  
  <style scoped>
  
  </style>