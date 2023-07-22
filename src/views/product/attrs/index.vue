<template>
  <div class="attrs">
    <el-card class="mb-10">
      <CategorySelector></CategorySelector>
    </el-card>
    <el-card>
      主体内容
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 按道理来说,写页面应该按步骤走,但是整个页面分为了上下两块内容
// 上面的内容是一个三级分类,可以作为一个公用组件来用,所以先写三级分类组件,然后返回再写页面
// 三级分类组件的步骤,详情见组件中
// 1. 静态搭建
// 2. 初始化数据展示
// 3. 交互
</script>

<style scoped>

</style>