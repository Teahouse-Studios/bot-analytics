<script setup lang="ts">
import { onMounted } from 'vue';

function getQueryString(name: string) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let search = window.location.href.split('?')[1];
  let r = search.match(reg);
  if (r != null) {
    return decodeURIComponent(r[2]);
  };
  return null;
}

onMounted(() => {
  try {
    const data_input = getQueryString('data_input');
    console.log(data_input);
    if (data_input) {
      localStorage.setItem('data_input', atob(data_input));
    }
  } catch (error) {

  }
})

</script>

<template>
  <el-config-provider namespace="ep">
    <BaseHeader />
    <div class="flex main-container">
      <BaseSide />
      <div w="full" py="4">
        <router-view />
      </div>
    </div>
  </el-config-provider>
</template>

<style>
#app {
  text-align: center;
  color: var(--ep-text-color-primary);
}

.main-container {
  height: calc(100vh - var(--ep-menu-item-height) - 3px);
}
</style>
