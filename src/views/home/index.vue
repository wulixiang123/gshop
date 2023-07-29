<template>
  <div class="home">
    <!-- Hello, {{userInfoStore.userInfo.name}} -->
    <!-- {{ echartsStore.echartsData }} -->
    <TopView class="mb-20"></TopView>
    <MiddleView class="mb-20"></MiddleView>
    <BottomView></BottomView>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Home',
}
</script>
<script lang="ts" setup>
import TopView from './components/TopView/index.vue'
import MiddleView from './components/MiddleView/index.vue'
import BottomView from './components/BottomView/index.vue'

import useEchartsStore from '@/stores/echarts';
import { onMounted } from 'vue';
const echartsStore = useEchartsStore()


onMounted(()=>{
  echartsStore.getEchartsData()
})
</script>

<style scoped>
  .home {
    width: 100%;
    height: 100%;
    padding: 20px;
    background-color: #bfa;
  }
</style>
