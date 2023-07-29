<template>
  <div class="home">
    <!-- Hello, {{userInfoStore.userInfo.name}} -->
    {{ echartsStore.echartsData }}
  </div>
</template>

<script lang="ts">
export default {
  name: 'Home',
}
</script>
<script lang="ts" setup>
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
  }
</style>
