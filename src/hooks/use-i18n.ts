import { useI18n } from 'vue-i18n-bridge'

export default {
	computed: {
		T(): any {
			return (source: any, ...args: any) => {
				const strType = Object.prototype.toString.call(source) === '[object String]'
				if (!strType || !/([a-zA-Z]+\.[a-zA-Z]+)+/.test(source)) {
					return source
				}
				try {
					// @ts-ignore
					return this.$t(source, [...args])
				} catch (error) {
					try {
						// @ts-ignore
						return vm.$t(source, [...args])
					} catch (error) {
						return source
					}
				}
			}
		}
	}
}
