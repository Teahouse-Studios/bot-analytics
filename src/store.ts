import { defineStore } from "pinia";
import * as fflate from 'fflate'
import { fileTypeFromBuffer } from "file-type";
import axios from "axios";



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
            const response = await axios.get(this.dataInputURL, { responseType: 'arraybuffer' })
            const fileType = await fileTypeFromBuffer(response.data)
            console.log(fileType)
            if (fileType && fileType.ext === 'zip'){
                const data = fflate.unzipSync(new Uint8Array(response.data))
                const file = new TextDecoder().decode(data[Object.keys(data)[0]])
                this.dataInput = JSON.parse(file)
            } else {
                this.dataInput = JSON.parse(new TextDecoder().decode(response.data))
            }
        }
    }
});