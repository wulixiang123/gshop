<template>
    <draggable class="wrapper" animation="200" v-model="sortList" item-key="id" @end="onEnd">
      <template #item="{ element }">
        <div class="item">
          {{ element.name }}
        </div>
      </template>
    </draggable>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import draggable from "vuedraggable"
  
  const sortList = ref([
    {
      id: 1001,
      name: '张三'
    },
    {
      id: 1002,
      name: '李四'
    },
    {
      id: 1003,
      name: '老六'
    },
  ])
  
  const onEnd = () => {
    console.log(sortList.value)
  }
  
  </script>
  
  <style scoped>
  .item {
    border: 1px solid #999;
    padding: 5px;
  }
  </style>