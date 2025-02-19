<template>
	<div class="pt-vnc-view">
		<div class="n-editor-toolbar">
			<div class="n-editor-toolbar__nav">
				<div class="nav-wrapper">
					<i class="el-icon-folder-opened nx-edit-file-open" />
					<span class="editor_url">{{ currentPath }}</span>
				</div>
			</div>
			<div class="n-editor-toolbar__actions">
				<el-select v-model="editorTheme" placeholder="请选择主题">
					<el-option v-for="(theme, index) in themes" :label="theme.name" :value="index" :key="index" />
				</el-select>
				<el-input
					v-model="searchKeyWords"
					:placeholder="$t('home.editor.search-tab')"
					clearable
					class="nx-search-input"
					suffix-icon="el-icon-search"
					@keydown.enter.native="searchDown"
					@clear="clearSearch"
				/>
			</div>
		</div>
		<div ref="editorRef" class="screen" :style="{ 'font-size': fontSize + 'px' }"></div>
	</div>
</template>

<script setup>
import { EditorView, keymap, lineNumbers } from "@codemirror/view"
import { Compartment, EditorSelection, SelectionRange } from "@codemirror/state"
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands"
import { highlightSelectionMatches, SearchCursor } from "@codemirror/search"
import { javascript } from "@codemirror/lang-javascript"
import { css } from "@codemirror/lang-css"
import { cpp } from "@codemirror/lang-cpp"
import { html } from "@codemirror/lang-html"
import { java } from "@codemirror/lang-java"
import { json } from "@codemirror/lang-json"
import { markdown } from "@codemirror/lang-markdown"
import { php } from "@codemirror/lang-php"
import { python } from "@codemirror/lang-python"
import { xml } from "@codemirror/lang-xml"
import themes from "./themes"
import { storeToRefs } from "pinia"
import { useNxTabsStore, useSettingStore } from "@/store"
import { getCurrentInstance, onMounted, ref, watchEffect } from "vue"

const props = defineProps({
	mode: {
		type: String,
		default: () => "full"
	},
	sessionId: undefined
})
const fontSize = ref(16)
const scale = ref(0)
const editorValue = ref("")
const oldValue = ref("")
const currentPath = ref("")
const searchKeyWords = ref("")
const editorTheme = ref(0)
const nxTabsStore = useNxTabsStore()
const { theme } = storeToRefs(useSettingStore())
const searchCursor = ref()
const themeConfig = ref(new Compartment())
const editorRef = ref()
const editorInstance = ref()
const instance = getCurrentInstance()
const proxy = getCurrentInstance()?.proxy
const sessionInstance = proxy.$sessionManager.getSessionInstanceById(props.sessionId)

function getSupportLangMode(type) {
	switch (type) {
		case ".js":
			return javascript()
		case ".css":
			return css()
		case ".cc":
			return cpp()
		case ".html":
			return html()
		case ".java":
			return java()
		case ".json":
			return json()
		case ".md":
			return markdown()
		case ".php":
			return php()
		case ".py":
			return python()
		case ".xml":
			return xml()
		default:
			return javascript()
	}
}

const zoom = () => (fontSize.value = Math.pow(1.1, scale.value) * 16)

const clearSearch = () => {
	searchKeyWords.value = ""
	searchCursor.value = null
}

const searchDown = () => {
	debugger
	if (!searchCursor.value) {
		return
	}
	const curr = searchCursor.value.next()
	if (curr.done) {
		return
	}
	editorInstance.value.dispatch({
		selection: EditorSelection.create([new SelectionRange(curr.value.from, curr.value.to)]),
		scrollIntoView: true
	})
}
watchEffect(() => {
	currentPath.value = sessionInstance?.remote_path ?? ""
	editorInstance.value?.dispatch({
		effects: themeConfig.value.reconfigure([themes[editorTheme.value]])
	})
	// 监听数据是否有变化
	nxTabsStore.updateEditChange(editorInstance.value?.state.doc.toString() !== oldValue.value)
	searchCursor.value = new SearchCursor(editorInstance.value?.state.doc, searchKeyWords.value)
})

const save = async () => {
	editorValue.value = editorInstance.value?.state.doc.toString()
	if (editorValue.value !== oldValue.value) {
		await sessionInstance.writeFileContent(editorValue.value)
		await sessionInstance.saveToRemote()
		oldValue.value = editorValue.value
		proxy.$notify({
			title: "编辑器保存",
			message: "修改内容已保存",
			type: "success"
		})
	}
}

onMounted(async () => {
	sessionInstance.on("close", () => {
		try {
			proxy.$destroy()
			proxy.$el.remove()
		} catch (e) {
			console.log("sftp editor instance remove error", e)
		}
	})
	await sessionInstance.init()
	const fileValue = await sessionInstance.readFileContent()
	editorValue.value = new TextDecoder().decode(fileValue)

	// 注册关闭事件
	sessionInstance.registerCloseCallback(save)
	const ctrl_s_key = [
		{
			key: "Ctrl-s",
			run: () => save()
		},
		{
			key: "Alt--",
			run: () => {
				if (scale.value > 0) {
					scale.value -= 1
					zoom()
				}
			}
		},
		{
			key: "Alt-=",
			run: () => {
				scale.value += 1
				zoom()
			}
		},
		{
			key: "Alt-0",
			run: () => {
				scale.value = 0
				zoom()
			}
		}
	]
	const lineWrapping = new Compartment()
	// 根据App主题初始化编辑器主题
	editorTheme.value = { dark: 1, light: 0, pink: 6 }[theme.value]
	const extensions = [
		keymap.of([...defaultKeymap, ...historyKeymap, ...ctrl_s_key, indentWithTab]),
		lineNumbers(),
		history(),
		highlightSelectionMatches(),
		lineWrapping.of(EditorView.lineWrapping),
		getSupportLangMode(sessionInstance.ext_name),
		themeConfig.value.of([themes[editorTheme.value]])
	]
	editorInstance.value = new EditorView({
		doc: editorValue.value,
		extensions: extensions,
		parent: editorRef.value,
		tabSize: 4
	})
	oldValue.value = editorInstance.value.state.doc.toString()
})
</script>

<style lang="scss" scoped>
.pt-vnc-view {
	height: 100%;
	width: 100%;
	background-color: var(--n-bg-color-base);

	.n-editor-toolbar {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		height: 40px;
		padding: 0 5px;

		&__nav {
			flex: 1 0 0;

			.nav-wrapper {
				display: flex;
				justify-content: flex-start;
				align-items: center;

				& > *:not(:last-child) {
					margin-right: 5px;
				}

				.nx-edit-file-open {
					font-size: 18px;
					color: var(--n-text-color-base);
					transition: color 0.2s;
				}

				.editor_url {
					color: var(--n-text-color-base);
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
					max-width: calc(100% - 20px);
				}
			}
		}

		&__actions {
			flex: 1 0 0;
			display: flex;
			justify-content: flex-end;
			align-items: center;

			& > *:not(:first-child) {
				margin-left: 5px;
			}
		}
	}

	.screen {
		width: 100%;
		height: calc(100% - 40px);
		overflow: auto;

		.cm-editor {
			height: 100%;
			overflow: auto;
		}
	}
}
</style>
