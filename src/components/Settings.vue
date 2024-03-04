<script setup lang="ts">
import { onMounted } from "vue";
import { ref } from "vue";

const data_input = ref("data.json");
const hide_secret_module = ref(true);
const hide_schedule_module = ref(true);


function syncSettings() {
    localStorage.setItem('data_input', data_input.value)
    localStorage.setItem('hide_secret_module', hide_secret_module.value.toString())
    localStorage.setItem('hide_schedule_module', hide_schedule_module.value.toString())
}


onMounted(() => {
    data_input.value = localStorage.getItem('data_input') || ''
    hide_secret_module.value = localStorage.getItem('hide_secret_module') === 'false' ? false : true
    hide_schedule_module.value = localStorage.getItem('hide_schedule_module') === 'false' ? false : true
});


</script>

<template>
    <div class="settings">
        <el-col :span="24">
            <el-input v-model="data_input" style="width: 240px" placeholder="数据 Json" clearable /> <el-button type="primary"
                @click="syncSettings">保存</el-button>
        </el-col>
        <el-switch v-model="hide_secret_module" class="ml-2" @change="syncSettings"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="隐藏秘密模块" />
        <el-switch v-model="hide_schedule_module" class="ml-2" @change="syncSettings"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" active-text="隐藏计划任务" />

    </div>
</template>