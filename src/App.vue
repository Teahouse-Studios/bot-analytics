<script setup lang="ts">
import { onMounted } from 'vue';


onMounted(() => {
  try {
  } catch (error) {

  }
})

</script>

<template>
  <el-config-provider namespace="ep">
    <BaseHeader />
    <div class="flex main-container">
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
  height: 100vh;
}
</style>
