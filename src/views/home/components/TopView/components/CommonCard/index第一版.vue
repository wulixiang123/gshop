<template>
    <el-card>
      <div class="title">今日销售额</div>
      <div class="count">30346788</div>
      <div class="main">
        <div class="content">
          <span class="mr-5">日同比</span>
          <span class="mr-5">-19.16</span>
          <span class="icon down"></span>
        </div>
        <div class="content">
          <span class="mr-5">月同比</span>
          <span class="mr-5">56.66</span>
          <span class="icon up"></span>
        </div>
      </div>
      <div class="line"></div>
      <div class="bottom">
        <span class="mr-10">昨日销售额</span>
        <span>36000000</span>
      </div>
    </el-card>
  </template>
  
  <script setup lang="ts">
  
  </script>
  
  <style lang="scss" scoped>
  .title {
    font-size: 12px;
    color: #aaa;
    margin-bottom: 5px;
  }
  .count {
    font-size: 26px;
    letter-spacing: 1px;
  }
  .main {
    height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .content {
      color: #999;
      font-size: 12px;
      font-weight: bold;
      display: flex;
      align-items: center;
    }
  }
  .line {
    width: 100%;
    height: 2px;
    background-color: #999;
    margin: 10px 0;
  }
  .bottom {
    font-size: 12px;
    color: #aaa;
  }
  // 箭头
  .down {
    margin-top: 5px;
    display: inline-block;
    border: 5px solid blue;
    border-left-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
  }
  .up {
    margin-top: -5px;
    display: inline-block;
    border: 5px solid red;
    border-left-color: transparent;
    border-right-color: transparent;
    border-top-color: transparent;
  }
  </style>