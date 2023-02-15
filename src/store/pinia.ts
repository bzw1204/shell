import Vue from 'vue'
import { createPinia, PiniaVuePlugin } from 'pinia'
import useAppStore from "./modules/nx-app";
import useSessionStore from "./modules/session";

Vue.use(PiniaVuePlugin)
const pinia = createPinia()

export { useAppStore, useSessionStore }

export default pinia