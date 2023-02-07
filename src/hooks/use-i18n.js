export default {
	data() {
		const vm = window.vm
		return {
			vm: vm
		}
	},
	computed: {
		T() {
			return (t, ...args) => {
				const strType = Object.prototype.toString.call(t) === '[object String]'
				if (!strType || !/([a-zA-Z]+\.[a-zA-Z]+)+/.test(t)) {
					return t
				}
				try {
					return this.$t(t, [...args])
				} catch (error) {
					try {
						return vm.$t(t, [...args])
					} catch (error) {
						return t
					}
				}
			}
		}
	}
}
