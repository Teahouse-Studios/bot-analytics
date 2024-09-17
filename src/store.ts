import { defineStore } from "pinia";


export const useStore = defineStore("main", {
    state: () => ({
        dataInput: {},
        dataInputURL: 'data.json',
        hideSecretModule: true,
        hideScheduleModule: true,
    }),
    actions: {
    }
});