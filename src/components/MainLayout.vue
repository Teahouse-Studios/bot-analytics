<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useStore } from '../store'
import { storeToRefs } from 'pinia'
const store = useStore()
import axios from "axios";
import ClipboardJS from 'clipboard';
import { ElNotification } from 'element-plus'
import { ElMessage } from 'element-plus'
const input = ref('')
const output = ref('')


onMounted(() => {

})


const encrypt = () => {
  axios.post(import.meta.env.VITE_BACKEND_URL + '/encrypt', { text: input.value }).then((res) => {
    output.value = res.data.encrypted
  })
}

const copy = () => {
  console.log('copy')
  let clipboard = new ClipboardJS(".copy_button", {
    text: () => {
      //返回需要复制的字符串
      return output.value;
    },
  });
  clipboard.on("success", () => {
    ElMessage({
      message: '复制成功',
      type: 'success'
    })
    clipboard.destroy();
  });
  clipboard.on("error", () => {
    ElMessage({
      message: '复制失败，请检查浏览器是否阻止了复制操作',
      type: 'error'
    })
    clipboard.destroy();
  });
};




</script>

<template>
  <div class="content-layout">
    <el-row justify="center" align="middle">
      <el-col :span="12">
        <el-space :size="30">
          <el-input v-model="input" style="width: 240px" placeholder="请输入待加密的文本" /><el-button @click="encrypt">提交</el-button>
        </el-space>
      </el-col>
    </el-row>
    <el-row justify="center" align="middle">
      <el-col :span="12">
        <el-space :size="30" v-show="output.length">
          加密后文本: {{ output }} <el-button @click="copy" class="copy_button">复制</el-button>
        </el-space>
      </el-col>

    </el-row>
  </div>
</template>

<style>
.content-layout {
  height: 100%;
  display: flex;
  display: grid;
  align-content: center;
  gap: 20px;

}
.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
  background-color: #18222c
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
