import { getCurrentInstance } from "vue";

// 访问vuex
export const useI18n = () => {
    const vm = getCurrentInstance();
    if (!vm) throw new Error("must be called in setup");
    return vm.proxy.$i18n;
}

export default {
    computed: {
        T() {
            return (t, ...args) => {
                const strType = Object.prototype.toString.call(t) === '[object String]'
                if (!strType || !/([a-zA-Z]+\.[a-zA-Z]+)+/.test(t)) {
                    return t
                }
                return this.$t(t, [...args])
            }
        }
    }
}