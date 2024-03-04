<template>
  <el-menu default-active="2" class="el-menu-vertical-demo" :collapse="isCollapse" @open="handleOpen"
    @close="handleClose">
    <router-link to="/">
      <el-menu-item index="1">
        <el-icon>
          <TrendCharts />
        </el-icon>
        <template #title>首页</template>
      </el-menu-item>
    </router-link>
    <router-link to="/racing">
      <el-menu-item index="1">
        <el-icon>
          <VideoPlay />
        </el-icon>
        <template #title>动态排序</template>
      </el-menu-item>
    </router-link>
    <router-link to="/settings">
      <el-menu-item index="4">
        <el-icon>
          <setting />
        </el-icon>
        <template #title>设置</template>
      </el-menu-item>
    </router-link>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  Setting,
  TrendCharts,
  VideoPlay
} from "@element-plus/icons-vue";

const isCollapse = ref(true);
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath);
};
</script>
