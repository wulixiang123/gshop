<template>
    <el-dialog
      :model-value="modelValue"
      @update:model-value="emits('update:modelValue', $event)"
      @close="emits('close')"
    >
      <el-table :data="tableData" border size="small">
        <el-table-column type="index" label="序号" width="55" align="center" />
        <el-table-column prop="tag" :label="config.title" align="center" />
        <el-table-column prop="status" label="操作状态" align="center" />
        <el-table-column prop="errorMessage" label="失败原因" align="center" />
      </el-table>
    </el-dialog>
  </template>
  
  <script setup lang="ts">
  import { watch, ref } from 'vue'
  
  // attrs这种思路也可以
  // import { useAttrs } from 'vue'
  // const attrs = useAttrs()
  const props = defineProps<{
    modelValue: boolean,
    config: {
      isFor: boolean,
      apiFn: Function,
      params: any[],
      title: string
    }
  }>()
  const emits = defineEmits<{
    (e: 'update:modelValue', bool: boolean): void,
    (e: 'close'): void
  }>()
  
  
  // 这个回调中就需要去兼容是发一次请求还是循环发多次请求
  // 如何知道发请求是一次还是多次?   假设一个布尔值来控制,true代表循环请求,false代表发一次请求
  // 如何知道请求发哪?  我们需要知道请求的api
  // 如何知道请求的参数? 我们需要知道发多个请求 或 一个请求的参数是什么
  // 发完请求之后,展示弹框中的表格,表格中的数据长什么样式?
  //    [
  //      {
  //        orderId: order.id,
  //        status: '成功',
  //        errorMessage: ''
  //      },
  //      {
  //        orderId: order.id,
  //        status: '成功',
  //        errorMessage: ''
  //      },
  //      ...
  //    ]
  //    这是之前的数据,有没有问题?
  //    有orderId写死了,表格展示的第二列
  //        <el-table-column prop="orderId" label="订单号" align="center" />
  //    的label也写死了
  // 这些问题,我们通过设置一个配置项来解决
  // {
  //   isFor: true, // true代表循环发请求,false发一次请求
  //   apiFn: () => {}, // 发请求的回调
  //   params: []  // 这里放数组,如果发一次请求,这个params的数组应该整体直接给后端
  //               // 如果是循环发多次请求,数组中的每一项应该是请求的参数
  //   title: '订单号' // 表格第二列展示的数据
  // }
  
  interface TableModel { // 表格要展示的数据
    tag: string | number, // 第二列,不能写死的那一列
    status: string, // 成功 / 失败
    errorMessage: string
  }
  const tableData = ref<TableModel[]>([])
  const getData = async () => {
    if (props.config.isFor) { // 循环发请求
      // 参数: [14667, 14667]
      props.config.params.forEach(async item => { // item就是发请求要携带的参数
        try {
          await props.config.apiFn(item)
          tableData.value.push({
            tag: item,
            status: '成功',
            errorMessage: ''
          })
        } catch (error: any) {
          tableData.value.push({
            tag: item,
            status: '失败',
            errorMessage: error?.message || '请求失败'
          })
        }
      })
    } else { // 发一次请求
      try {
        await props.config.apiFn(props.config.params) // 发一次请求,给后端传一个数组过去
        props.config.params.forEach(item => { // item是每一个参数
          tableData.value.push({
            tag: item,
            status: '成功',
            errorMessage: ''
          })
        })
      } catch (error: any) {
        props.config.params.forEach(item => { // item是每一个参数
          tableData.value.push({
            tag: item,
            status: '失败',
            errorMessage: error.message || '请求失败'
          })
        })
      }
    }
  }
  
  
  // 批量操作的两种情况:
  //    1. 发送给后端一个请求,携带一个数组给后端,进行批量操作,  例如: 前台项目购物车页面中"删除选中商品"功能调用的接口是一个接口,传给后端一个数组
  //    2. 循环发送请求,每次携带一个参数,进行批量操作, 例如: 当前批量签收
  // 问: 什么请款下发请求
  //    当弹框弹出的时候发请求
  // 问: 如何知道弹框弹出
  //    props接的modelValue为true的时候,弹框弹出
  watch(() => props.modelValue, (nval) => {
    if (nval) { // 发请求
      getData()
    } else { // 清空数据
      tableData.value = []
    }
  })
  
  </script>
  
  <style scoped></style>