import VueI18n from "vue-i18n";
import zh from './lang/zh-CN.json'
import en from './lang/en-US.json'
import Vue from 'vue'

Vue.use(VueI18n)
// 创建vue-i18n实例i18n
const i18n = new VueI18n({
    // 设置默认语言
    locale: 'zh', // 语言标识
    // 添加多语言（每一个语言标示对应一个语言文件）
    messages: {
        zh,
        en
    }
})
export default i18n