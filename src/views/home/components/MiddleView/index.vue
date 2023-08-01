<template>
  <el-card class="middle-view">
    <div class="header">
      <el-menu
      :default-active="activeIndex"
      class="menu"
      mode="horizontal"
      @selsct="selectHandler"
      >
      <el-menu-item index="1">销售量</el-menu-item>
      <el-menu-item index="2">访问量</el-menu-item>
    </el-menu>

    <el-radio-group v-model="radio1" class="mr-10">
      <el-radio-button label="今天"></el-radio-button>
      <el-radio-button label="本周"></el-radio-button>
      <el-radio-button label="本月"></el-radio-button>
      <el-radio-button label="今年"></el-radio-button>
    </el-radio-group>

    <div class="datepicker">
      <el-date-picker
        v-model="value"
        type="daterange"
        unlink-panels
        range-separator="To"
        start-placeholder="开始时间"
        end-placeholder="结束时间"
        :shortcuts="shortcuts"
      />
    </div>
    </div>

    <el-row>
      <el-col :span="18">
        <LeftView :activeIndex="activeIndex"></LeftView>
      </el-col>
      <el-col :span="6">
        <RightView></RightView>
      </el-col>
    </el-row>

  </el-card>    
</template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import RightView from './RightView.vue'
  import LeftView from './LeftView.vue'
  const activeIndex = ref('1')

  const selectHandler = (val:string)=>{
    activeIndex.value = val
  }

  const radio1 = ref('今天')
  const value = ref('')

const shortcuts = [
  {
    text: '上周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [start, end]
    },
  },
  {
    text: '上月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [start, end]
    },
  },
  {
    text: '上个季度',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      return [start, end]
    },
  },
]
  </script>
  
  <style scoped>
  .middle-view{
    .header{
      display: flex;
      align-items: center;
      border-bottom: solid 1px var(--el-menu-border-color);
      .menu{
        flex: 1;
        border:none
      }
      .datepicker{
        width:350px
      }      
    }
  }
  </style>