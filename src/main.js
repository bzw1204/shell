import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@fontsource/dejavu-mono";
import "./assets/scss/default.scss";
import PtComponents from "@/components";
import PtSessionManger from "@/services";
import pinia from '@/store/pinia'
import Element from './element'
import '@/icons'
import i18n from '@/local'
import i18nMixins from '@/hooks/use-i18n'

Vue.use(PtComponents);
Vue.use(PtSessionManger);
Vue.use(Element)
Vue.mixin(i18nMixins)
Vue.config.productionTip = false;

!async function () {
    await PtSessionManger.initService();

    new Vue({
        router,
        store,
        pinia,
        i18n,
        render: h => h(App)
    }).$mount("#app");
}();

window.addEventListener("keydown", (evt) => {
    if (evt.ctrlKey && evt.key === "r") {
        evt.preventDefault();
    }
    if (evt.metaKey && evt.key === "r") {
        evt.preventDefault();
    }
})