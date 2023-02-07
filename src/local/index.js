import VueI18n from 'vue-i18n'
import zh from './lang/zh-CN.json'
import en from './lang/en-US.json'
import Vue from 'vue'
import * as globalSetting from '@/services/globalSetting'

Vue.use(VueI18n)
const language = globalSetting.getProfile('xterm')?.language ?? 'zh-CN'

// 创建vue-i18n实例i18n
const i18n = new VueI18n({
	// 设置默认语言
	locale: language, // 语言标识
	// 添加多语言（每一个语言标示对应一个语言文件）
	messages: {
		'zh-CN': zh,
		'en-US': en
	}
})
export default i18n
