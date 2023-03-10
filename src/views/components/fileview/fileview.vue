<template>
	<div class="pt-file-view">
		<!-- 头部工具栏 -->
		<nx-toolbar />
		<!--		<pt-grid-view-->
		<!--			:mode="layout"-->
		<!--			:columns="columns"-->
		<!--			:data="fileList"-->
		<!--			@open="handleOpen($event)"-->
		<!--			@refresh="refresh"-->
		<!--			@delete="handleDelete($event)"-->
		<!--			@go-back="goBack()"-->
		<!--			@change="handleFileSelectedChange"-->
		<!--			@contextmenu="handleFileItemContextMenu($event)"-->
		<!--			@file-drop="handleFileDrop"-->
		<!--			@file-sort="handleFileSort"-->
		<!--			v-context-menu="handleGetContextMenu"-->
		<!--		/>-->
		<!--		<file-status-bar-->
		<!--			:file-total="fileList.length"-->
		<!--			:selected-length="selectedItems.length"-->
		<!--			:progress-desc="currentProgressStatus.description"-->
		<!--			:show-progress="currentProgressStatus.show"-->
		<!--			:progress="currentProgressStatus.progress"-->
		<!--			:speed="currentProgressStatus.speed"-->
		<!--		/>-->
	</div>
</template>

<script lang="ts">
	export default {
		name: 'PtFileView'
	}
</script>

<script lang="ts" setup>
	import NxToolbar from './components/toolbar/index.vue'
	import { useI18n } from 'vue-i18n-bridge'
	import { onMounted } from 'vue'

	const { t } = useI18n()
	const props = defineProps<{ getFs: Function }>()

	// const readdir = async (dirPath:string) => {
	// 	let dirents;
	// 	try {
	// 		const fsInstance = await this.getFs();
	// 		dirents = await fsInstance.readdir(dirPath);
	// 	} catch (err) {
	// 		this.$confirm({
	// 			title: this.T("home.fileview.confirm-dialogs.errors.title"),
	// 			message: this.T("home.fileview.confirm-dialogs.errors.error-message", err.message),
	// 			type: "error"
	// 		});
	// 		return false;
	// 	}
	//
	// 	// for move directory list
	// 	this.moveDialog.dirnameList = ['..'];
	//
	// 	const dirList = dirents.filter((dirent) => {
	// 		if (dirent.isDirectory()) {
	// 			this.moveDialog.dirnameList.push(dirent.name)
	// 			return dirent;
	// 		}
	// 	});
	// 	dirList.sort(sort);
	//
	// 	const fileList = dirents.filter((dirent) => {
	// 		if (!dirent.isDirectory()) {
	// 			return dirent;
	// 		}
	// 	});
	// 	fileList.sort(sort);
	//
	// 	let List = [...dirList, ...fileList];
	// 	this.fileItems = List.map((dirent) => {
	// 		const { icon, type } = this.getIconAndType(dirent);
	// 		return {
	// 			name: dirent.name,
	// 			icon: icon,
	// 			iconType: "img",
	// 			size: dirent.isDirectory() ? "" : formatFileSize(dirent.getSize()),
	// 			sizeByte: dirent.getSize(),
	// 			type: type,
	// 			user: dirent.getUid(),
	// 			group: dirent.getGid(),
	// 			lastModify: this.T("home.fileview.mainview.columns.fmt-time", dirent.getMTime()),
	// 			perms: dirent.getPermsString(),
	// 			dirent
	// 		}
	// 	});
	//
	// 	return true;
	// }
	const result = async () => {
		const fsInstance = await props.getFs()
		const result = await fsInstance.readdir('/')
		console.log('result', result)
	}
	result()
</script>

<style lang="scss" scoped>
.pt-file-view {
	position: relative;
	width: 100%;
	height: 100%;

	.pt-grid-view {
		height: calc(100% - 72px);
	}

	.status-description {
		width: 260px;
		text-align: right;
	}

	::v-deep .el-input__inner {
		border: 1px solid var(--n-bg-color-base) !important;
	}
}

.file-prop-dialog {
	width: 100%;
	height: 400px;

	.info-block {
		padding: 20px 20px;

		.pt-row {
			margin-bottom: 10px;
		}
	}

	.file-base-info {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		margin-bottom: 10px;

		.pt-icon-wrapper {
			margin-right: 10px;
		}
	}
}

.create-dir-dialog {
	width: 300px;
	margin: {
		top: 30px;
		bottom: 40px;
	}

	.invalid-dir-name {
		margin-top: 15px;
		color: var(--dangerColor);
	}
}

.move-dir-dialog {
	margin: {
		top: 30px;
		bottom: 40px;
	}
	display: flex;
	justify-content: center;

	.move-dir-select {
		width: 300px;
	}
}

.ask-dialog {
	margin: {
		top: 30px;
		bottom: 40px;
	}

	.message {
		margin-bottom: 20px;
	}

	.file-summary {
		margin: {
			left: 20px;
			right: 20px;
			bottom: 20px;
		}
	}
}
</style>
