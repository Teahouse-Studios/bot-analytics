<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as echarts from 'echarts';
import { useStore } from '../store'
import { storeToRefs } from 'pinia'


const store = useStore()
const { dataInput, hideSecretModule, hideScheduleModule } = storeToRefs(store)


const datas: Datas = {
  'data': {},
  'modules': [],
  'version': 0,
  'timestamp': 0
}

var chartTotalCallInstance: echarts.ECharts | null = null
var chartModuleCallInstance: echarts.ECharts | null = null

const totalFilter = ref('')

const chartTotalCallMode = ref('month')
const chartModuleCallMode = ref('1')

interface Restaurant {
  value: string;
}

const restaurants = ref<Restaurant[]>([])

const filterSearch = (query: string, items: any) => {
  return items.filter((item: any) => {
    if (item.value.startsWith('_') && hideSecretModule.value) {
      return false
    }
    if (item.value.startsWith(query)) {
      return true
    }
  })
}
const querySearch = (queryString: string, cb: any) => {
  let results = queryString ? filterSearch(queryString, restaurants.value) : restaurants.value.filter((item) => {
    if (item.value.startsWith('_') && hideSecretModule.value) {
      return false
    }
    return true
  })
  cb(results)
}

onMounted(() => {
  store.flush()
  console.log(hideSecretModule.value)
  console.log(hideScheduleModule.value)

  chartTotalCallInstance = echarts.init(document.getElementById('charts-total-calls') as HTMLDivElement);
  chartModuleCallInstance = echarts.init(document.getElementById('charts-module-calls') as HTMLDivElement);
  chartTotalCallInstance.setOption({
    title: {
      text: '总调用量',
    },
    tooltip: {},
    xAxis: {
      data: [],
    },
    yAxis: {
      max: 'dataMax'
    },
    series: [
      {
        name: '调用量',
        type: 'bar',
      }
    ],
  })
  chartModuleCallInstance.setOption({
    title: {
      text: '模块调用量',
    },
    tooltip: {},
    yAxis: {
      data: [],
      axisLabel: {
        marginLeft: 50,
      }
    },
    xAxis: {
      max: 'dataMax'
    },
    series: [
      {
        name: '调用量',
        type: 'bar',
      }
    ],
    dataZoom: [
      {
        type: "inside",
        startValue: 0,
        endValue: 10,
        minValueSpan: 10,
        maxValueSpan: 10,
        yAxisIndex: [0],
        zoomOnMouseWheel: false, 
        moveOnMouseWheel: true,
        moveOnMouseMove: true
      },
      {
        type: 'slider',
        realtime: true,
        startValue: 0,
        endValue: 2,
        width: '3.5',
        height: '80%',
        yAxisIndex: [0],
        fillerColor: "rgba(154, 181, 215, 1)",
        borderColor: "rgba(17, 100, 210, 0.12)",
        backgroundColor: '#cfcfcf',
        handleSize: 0, 
        showDataShadow: false,
        showDetail: false,
        top: '1%',
        right: '5',
      }

    ],
    grid: {
      left: 120,
    }
  })

  window.addEventListener("resize", (e) => {
    if (chartTotalCallInstance) {
      chartTotalCallInstance.resize()
    }
    if (chartModuleCallInstance) {
      chartModuleCallInstance.resize()
    }
  });
  store.fetchData().then(() => {
    Object.assign(datas, dataInput.value)
  }).then(() => {
    arrange()
    restaurants.value = Object.keys(datas['modules']).map((value) => {
      return {
        value: datas['modules'][parseInt(value)],
      }
    })
  })

})

function arrange_total_calls_data() {
  let option = {
    xAxis: {
      data: [] as string[],
    },
    series: [
      {
        name: '调用量',
        type: 'bar',
        data: [] as number[]
      }
    ]
  }
  let arrangeTemp: {
    [dateString: string]: number;
  } = {}
  let currentDate = new Date()
  let useDates = []
  if (chartTotalCallMode.value === 'month') {
    for (let i = 0; i < 30; i++) {
      let tempDate = new Date(currentDate)
      tempDate.setDate(tempDate.getDate() - i)
      useDates.push(`${tempDate.getFullYear().toString()}-${(tempDate.getMonth() + 1).toString().padStart(2, '0')}-${tempDate.getDate().toString().padStart(2, '0')}`)
    }
  } else if (chartTotalCallMode.value === 'year') {
    for (let i = 0; i < 12; i++) {
      let tempDate = new Date(currentDate)
      tempDate.setMonth(tempDate.getMonth() - i)
      for (let dateString in datas['data']) {
        if (dateString.startsWith(`${tempDate.getFullYear().toString()}-${(tempDate.getMonth() + 1).toString().padStart(2, '0')}`)) {
          useDates.push(dateString)
        }
      }
    }
  } else {
    useDates = Object.keys(datas['data'])
  }
  for (let dateString of useDates) {
    if (datas['data'][dateString]) {
      let count = 0
      for (let senderId in datas['data'][dateString]) {
        for (let targetId in datas['data'][dateString][senderId]) {
          for (let moduleName in datas['data'][dateString][senderId][targetId]) {
            if (moduleName.startsWith('_') && hideSecretModule.value) {
              continue
            }
            if (datas['data'][dateString][senderId][targetId][moduleName].type === 'schedule' && hideScheduleModule.value) {
              continue
            }
            if (totalFilter.value && !(moduleName === totalFilter.value)) {
              continue
            }

            count += datas['data'][dateString][senderId][targetId][moduleName].count
          }
        }
      }
      arrangeTemp[dateString] = count
    }
  }
  // sort by date
  arrangeTemp = Object.fromEntries(Object.entries(arrangeTemp).sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()))
  for (let dateString in arrangeTemp) {
    option.xAxis.data.push(dateString)
    option.series[0]['data'].push(arrangeTemp[dateString])
  }
  if (chartTotalCallInstance) {
    chartTotalCallInstance.setOption(option);
  }

}

function arrange_module_calls_data() {
  let option = {

    yAxis: {
      data: [] as string[],

    },
    series: [
      {
        name: '调用量',
        type: 'bar',
        data: [] as number[]
      }
    ]

  }
  let arrangeTemp: {
    [moduleName: string]: {
      counts: number;
    };
  } = {}
  let currentDate = new Date()
  let useDates = []
  if (chartModuleCallMode.value === 'all') {
    useDates = Object.keys(datas['data'])
  } else {
    for (let i = 0; i < parseInt(chartModuleCallMode.value); i++) {
      let tempDate = new Date(currentDate)
      tempDate.setDate(tempDate.getDate() - i)
      useDates.push(`${tempDate.getFullYear().toString()}-${(tempDate.getMonth() + 1).toString().padStart(2, '0')}-${tempDate.getDate().toString().padStart(2, '0')}`)
    }
  }

  for (let dateString of useDates) {
    for (let senderId in datas['data'][dateString]) {

      for (let targetId in datas['data'][dateString][senderId]) {
        for (let moduleName in datas['data'][dateString][senderId][targetId]) {

          if (moduleName.startsWith('_') && hideSecretModule.value) {
            continue
          }
          if (datas['data'][dateString][senderId][targetId][moduleName].type === 'schedule' && hideScheduleModule.value) {
            continue
          }
          if (!arrangeTemp[moduleName]) {
            arrangeTemp[moduleName] = {
              counts: 0,
            }
          }
          arrangeTemp[moduleName].counts += datas['data'][dateString][senderId][targetId][moduleName].count
        }
      }
    }
  }
  arrangeTemp = Object.fromEntries(Object.entries(arrangeTemp).sort(([, a], [, b]) => b.counts - a.counts))
  for (let moduleName in arrangeTemp) {

    if (!option.yAxis.data.includes(moduleName)) {
      option.yAxis.data.push(moduleName)
    }
    option.series[0]['data'].push(arrangeTemp[moduleName].counts)
  }
  if (chartModuleCallInstance) {
    chartModuleCallInstance.setOption(option);
  }

}

function arrange() {
  arrange_total_calls_data()
  arrange_module_calls_data()
}


</script>

<template>
  <el-row justify="center">
    <el-col :span="12">
      <el-space :size="30">
        <el-radio-group v-model="chartTotalCallMode" class="ml-4" @change="arrange_total_calls_data">
          <el-radio value="month">30日</el-radio>
          <el-radio value="year">年</el-radio>
          <el-radio value="all">所有</el-radio>
        </el-radio-group>
        <el-autocomplete v-model="totalFilter" :fetch-suggestions="querySearch" clearable class="inline-input w-30"
          select-when-unmatched placeholder="筛选" @select="arrange" @clear="arrange" />
      </el-space>

      <div id="charts-total-calls" style="width: 100%; height:400px;"></div>
    </el-col>
    <el-col :span="12">
      <el-radio-group v-model="chartModuleCallMode" class="ml-4" @change="arrange_module_calls_data">
        <el-radio value="1">1日</el-radio>
        <el-radio value="30">30日</el-radio>
        <el-radio value="365">365日</el-radio>
        <el-radio value="all">所有</el-radio>
      </el-radio-group>
      <div id="charts-module-calls" style="width: 100%; height:400px;"></div>
    </el-col>


  </el-row>
</template>

<style>
.el-row {
  margin-bottom: 20px;
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
