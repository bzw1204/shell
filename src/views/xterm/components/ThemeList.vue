<template>
	<div ref="themeListRef" class="nx-theme-list">
		<div class="content">
			<theme-preview
				v-for="(theme, index) in themeList"
				:key="index"
				:theme-name="theme"
				class="theme-item"
				:class="{ 'theme-selected': selectedTheme === theme }"
				:theme.prop="theme"
				@click.native="handleSelect"
			/>
		</div>
	</div>
</template>

<script setup>
import xtermTheme from 'xterm-theme'
import ThemePreview from '@/views/xterm/components/ThemePreview.vue'
import BScroll from '@better-scroll/core'
import MouseWheel from '@better-scroll/mouse-wheel'
import { onMounted, onUpdated, ref } from 'vue'

BScroll.use(MouseWheel)
const themeListRef = ref()
const searchKey = ref('')
const themeList = ref([])
let scrollBar = null

onMounted(() => {
	themeList.value = Object.keys(xtermTheme)
	scrollBar = new BScroll(themeListRef.value, {
		scrollY: true,
		click: true,
		mouseWheel: true,
		scrollbar: true
	})
	scrollBar.refresh()
})
onUpdated(() => {
	scrollBar.refresh()
})
const emits = defineEmits(['change', 'search'])
const selectedTheme = ref()
const handleSelect = (e) => {
	const themeName = e.currentTarget.theme
	selectedTheme.value = themeName
	emits('change', themeName)
}
const handleSearch = (value) => {
	themeList.value = Object.keys(xtermTheme).filter((x) => {
		if (x.includes(value)) {
			return x;
		}
	})
}
</script>

<style lang="scss" scoped>
.nx-theme-list {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	overflow: hidden;

	.content {
		height: auto;
		display: inline-flex;
		flex-direction: column;
		//overflow: auto;

		.theme-item {
			width: 400px;

			&::before {
				content: '';
				width: 100%;
				height: 1px;
				background: transparent;
			}

			&:hover {
				cursor: pointer;
			}
		}

		.theme-selected {
			background: var(--n-theme-selected);

			&::before {
				background: #165dff;
			}
		}
	}
}
</style>
