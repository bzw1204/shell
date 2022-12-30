import Vue from 'vue'
import {createPinia, PiniaVuePlugin} from 'pinia'
import useAppStore from "./modules/nx-app";

Vue.use(PiniaVuePlugin)
const pinia = createPinia()

export {useAppStore}

export default pinia