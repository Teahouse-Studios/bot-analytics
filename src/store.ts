import { defineStore } from "pinia";
import * as fflate from 'fflate'


export const useStore = defineStore("main", {
    state: () => ({
        dataInput: {},
        dataInputURL: 'data.json',
        hideSecretModule: true,
        hideScheduleModule: true,
    }),
    actions: {
        flush() {
            this.dataInputURL = localStorage.getItem('data_input') || ''
            this.hideSecretModule = localStorage.getItem('hide_secret_module') === 'false' ? false : true
            this.hideScheduleModule = localStorage.getItem('hide_schedule_module') === 'false' ? false : true
        },
        async fetchData() {
            if (this.dataInputURL.endsWith('.json')) {
                const response = await fetch(this.dataInputURL)
                this.dataInput = await response.json()
            } else if (this.dataInputURL.endsWith('.zip')){
                const response = await fetch(this.dataInputURL)
                const buffer = await response.arrayBuffer()
                const data = fflate.unzipSync(new Uint8Array(buffer))
                this.dataInput = JSON.parse(new TextDecoder().decode(data[Object.keys(data)[0]]))
            }
        }
    }
});