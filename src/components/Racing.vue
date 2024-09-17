<script setup lang="ts">
import { onMounted } from "vue";
import { useStore } from '../store'
import { storeToRefs } from 'pinia'

import * as echarts from 'echarts/core';
import { BarChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  GraphicComponent
} from 'echarts/components';

import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  GraphicComponent,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
]);


const store = useStore()
const { dataInput, hideScheduleModule, hideSecretModule } = storeToRefs(store)
const datas: Datas = {
    'data': {},
    'modules': [],
    'version': 0,
    'timestamp': 0
}

const moduleCallRacingData: number[] = []

const moduleCallRacingOption: any = {
    xAxis: {
        max: 'dataMax'
    },
    yAxis: {
        type: 'category',
        data: [],
        inverse: true,
        animationDuration: 300,
        animationDurationUpdate: 300,
        max: 20
    },
    series: [
        {
            realtimeSort: true,
            name: '调用量',
            type: 'bar',
            data: moduleCallRacingData,
            label: {
                show: true,
                position: 'right',
                valueAnimation: true
            }
        }
    ],
    legend: {
        show: true
    },
    animationDuration: 500,
    animationDurationUpdate: 500,
    animationEasing: 'linear',
    animationEasingUpdate: 'linear',
    graphic: {
        elements: [
            {
                type: 'text',
                right: 160,
                bottom: 60,
                style: {
                    text: 0,
                    font: 'bolder 80px monospace',
                    fill: 'rgba(100, 100, 100, 0.25)'
                },
                z: 100
            }
        ]
    }
};

var chartModuleCallInstance: echarts.ECharts | null = null

function update() {
    let data = moduleCallRacingOption.series[0].data;
    if (Object.keys(datas['data']).length > 0) {
        let first_key = Object.keys(datas['data'])[0]
        moduleCallRacingOption.graphic.elements[0].style.text = first_key;
        let first_data = datas.data[first_key]
        for (let senderId in first_data) {
            for (let targetId in first_data[senderId]) {
                for (let moduleName in first_data[senderId][targetId]) {
                    let moduleIndex = datas['modules'].indexOf(moduleName)
                    if (moduleIndex >= 0) {
                        if (moduleName.startsWith('_') && hideSecretModule.value) {
                            continue
                        }
                        if (first_data[senderId][targetId][moduleName].type === 'schedule' && hideScheduleModule.value) {
                            continue
                        }
                        data[moduleIndex] += first_data[senderId][targetId][moduleName].count
                    }
                }

            }
        }
        delete datas['data'][first_key]
    }
    if (chartModuleCallInstance) {
        chartModuleCallInstance.setOption(moduleCallRacingOption);
    }
}


function startModuleCallRacing() {
    for (let moduleIndex in datas['modules']) {
        moduleCallRacingOption.yAxis.data.push(datas['modules'][moduleIndex])
        moduleCallRacingData.push(0)
    }
    update();
    setInterval(function () {
        update();
    }, 500);
}

onMounted(() => {
    store.flush()
    chartModuleCallInstance = echarts.init(document.getElementById('racing-module-call-chart') as HTMLDivElement);
    store.fetchData().then(() => {
        Object.assign(datas, dataInput.value)
    })
    chartModuleCallInstance.setOption(moduleCallRacingOption);
    window.addEventListener("resize", (e) => {
        if (chartModuleCallInstance) {
            chartModuleCallInstance.resize()
        }
    });
});

</script>

<template>
    <el-row justify="center">
        <el-button type="primary" @click="startModuleCallRacing">开始</el-button>
        <div id="racing-module-call-chart" style="width: 100%; height: 90vh;"></div>
    </el-row>
</template>