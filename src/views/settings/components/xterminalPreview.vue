<template>
	<div class="n-terminal-preview" v-bind="$attrs">
		<div class="color-dot-wrapper">
			<span class="color-name">{{ props.themeName }}</span>
			<div class="color-dot">
				<span class="color-dot-item" v-for="(item,index) in colorList" :key="index" :style="{background: item}"></span>
			</div>
		</div>
		<div class="theme-color" :style="themeStyle">
			<div class="theme-color-item">
				<span :style="{color: currentTheme.white}">[</span>
				<span :style="{color: currentTheme.green}">root</span>
				<span :style="{color: currentTheme.cyan}">@</span>
				<span :style="{color: currentTheme.blue}">nxshell </span>
				<span :style="{color: currentTheme.blue}">~</span>
				<span :style="{color: currentTheme.white}">]&nbsp;</span>
				<span :style="{color: currentTheme.red}"># </span>
				<span :style="{color: currentTheme.white}">ls -all</span>
			</div>
			<div class="theme-color-item">
				<span :style="{color: currentTheme.white}">drwxr-xr-x 3 root root 6 11月 26 2019&nbsp;</span>
				<span :style="{color: currentTheme.yellow}">Documents</span>
			</div>
			<div class="theme-color-item">
				<span :style="{color: currentTheme.white}">drwxr-xr-x 3 root root 6 11月 26 2019&nbsp;</span>
				<span :style="{color: currentTheme.black,background: currentTheme.green}">Downloads</span>
			</div>
			<div class="theme-color-item">
				<span :style="{color: currentTheme.white}">drwxr-xr-x 3 root root 6 11月 26 2019&nbsp;</span>
				<span :style="{color: currentTheme.black,background: currentTheme.brightBlack}">Pictures</span>
			</div>
			<div class="theme-color-item">
				<span :style="{color: currentTheme.white}">drwxr-xr-x 3 root root 6 11月 26 2019&nbsp;</span>
				<span :style="{color: currentTheme.brightBlue}">Music</span>
			</div>
			<div class="theme-color-item">
				<span :style="{color: currentTheme.white}">[</span>
				<span :style="{color: currentTheme.green}">root</span>
				<span :style="{color: currentTheme.cyan}">@</span>
				<span :style="{color: currentTheme.blue}">nxshell </span>
				<span :style="{color: currentTheme.blue}">~</span>
				<span :style="{color: currentTheme.white}">]&nbsp;</span>
				<span :style="{color: currentTheme.red}"># </span>
				<span :style="{color: currentTheme.white}" :class="{'cursor-blink':props.cursorBlink}">
					{{ cursorStyle }}
				</span>
			</div>
		</div>
	</div>
</template>

<script setup>
import xtermTheme from "xterm-theme";
import { onMounted, ref, watch, watchEffect } from "vue";

const props = defineProps({
	themeName: '',
	fontFamily: '',
	fontSize: '12px',
	fontWeight: 'normal',
	lineHeight: '1',
	letterSpacing: 'normal',
	cursorStyle: 'block',
	cursorBlink: false
})
const ignoreProps = ['background', 'cursor', 'cursorAccent', 'foreground', 'selection']
const colorList = ref([])
const currentTheme = ref({})
const CURSOR_STYLE = { block: "█", bar: "|", underline: "▁" }
const cursorStyle = ref("█")
const themeStyle = ref({})

function initThemePreview() {
	currentTheme.value = xtermTheme[props.themeName ?? Object.keys(xtermTheme)[0]]
	colorList.value = []
	for (const key in currentTheme.value) {
		if (!ignoreProps.includes(key)) {
			colorList.value.push(currentTheme.value[key])
		}
	}
	themeStyle.value = {
		background: currentTheme.value.background,
		fontFamily: props.fontFamily,
		fontWeight: props.fontWeight,
		fontSize: props.fontSize + 'px',
		lineHeight: props.lineHeight,
		letterSpacing: props.letterSpacing + 'px'
	}

	cursorStyle.value = CURSOR_STYLE[props.cursorStyle ?? 'bar']
}

onMounted(() => {
	initThemePreview()
})
watchEffect(() => {
	initThemePreview()
	console.log(props.themeName)
})
watch(() => props.themeName, () => {
	console.log('mz', props.themeName)
})
</script>

<style lang="scss" scoped>
.n-terminal-preview {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	row-gap: 10px;
	padding: 10px;
	min-width: 380px;

	.color-dot-wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 0px 10px 5px;
		width: 100%;
		box-sizing: border-box;

		.color-name {
			flex: 1;
			color: var(--n-text-color-base);
			font-size: 14px;
			font-weight: bold;
		}

		.color-dot {
			flex: 1;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			column-gap: 2px;
			row-gap: 5px;

			.color-dot-item {
				width: 10px;
				height: 10px;
			}
		}

	}

	.theme-color {
		display: flex;
		flex-direction: column;
		row-gap: 2px;
		width: 100%;
		height: 100%;
		padding: 5px 5px 20px 5px;
		box-sizing: border-box;
		backdrop-filter: blur(5px);
		white-space: nowrap;
		overflow: hidden;

		&-item {
			width: 100%;
			height: 100%;
		}
	}
}

@keyframes blinkFrame {
	0% {
		opacity: 1;
	}
	25% {
		opacity: 0.5;
	}
	50% {
		opacity: 0.25;
	}
	100% {
		opacity: 0;
	}
}

.cursor-blink {
	animation: blinkFrame 1s linear 1000ms infinite;
}
</style>