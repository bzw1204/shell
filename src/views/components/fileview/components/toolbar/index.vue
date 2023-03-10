<template>
	<pt-toolbar :centerStyle="{ overflow: 'hidden', marginLeft: '10px', marginRight: '10px' }">
		<template #left>
			<n-space :size="5">
				<el-tooltip
					class="item"
					effect="dark"
					:content="t('home.fileview.mainview.go-back')"
					placement="right-end"
				>
					<el-button type="text" icon="el-icon-back" :disabled="!navigation.canBack" @click="goBack" />
				</el-tooltip>
				<el-tooltip
					class="item"
					effect="dark"
					:content="t('home.fileview.mainview.go-forward')"
					placement="right-end"
				>
					<el-button type="text" icon="el-icon-right" :disabled="!navigation.canForward" @click="forward" />
				</el-tooltip>
				<el-tooltip
					class="item"
					effect="dark"
					:content="t('home.fileview.mainview.go-up')"
					placement="right-end"
				>
					<el-button type="text" icon="el-icon-top" :disabled="!navigation.canUp" @click="goUp" />
				</el-tooltip>
				<el-tooltip
					class="item"
					effect="dark"
					:content="t('home.fileview.mainview.go-refresh')"
					placement="right-end"
				>
					<el-button type="text" icon="el-icon-refresh" :disabled="!navigation.refresh" @click="refresh" />
				</el-tooltip>
			</n-space>
		</template>
		<pt-file-view-address
			#center
			v-model="navigation.currentPath"
			:hostInfo="navigation.hostInfo"
			:getFolderList="getFolderList"
			:checkPath="checkPath"
			@change="goTo($event)"
		/>
		<template #right>
			<el-input
				v-model="searchKeyWords"
				:placeholder="t('home.fileview.mainview.search-tab')"
				clearable
				class="nx-search-input"
				suffix-icon="el-icon-search"
			/>
		</template>
	</pt-toolbar>
</template>

<script lang="ts" setup>
import PtToolbar from '@/components/bars/toolbar.vue'
import PtFileViewAddress from '@/views/components/fileview/address.vue'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n-bridge'

const { t } = useI18n()

interface INav {
	canBack: boolean
	canForward: boolean
	canUp: boolean
	refresh: boolean
	currentPath: string
	hostInfo: Record<string, any>
}

const navigation = reactive<INav>({
	canBack: true,
	canForward: true,
	canUp: true,
	refresh: true,
	currentPath: '',
	hostInfo: {}
})
const searchKeyWords = ref('')

const getFolderList = async (dirPath: string) => {
	// const fsInstance = await this.getFs()
	// const dirents = await fsInstance.readdir(dirPath)

	// const dirList = dirents.filter((dirent) => {
	// 	if (dirent.isDirectory()) {
	// 		return dirent
	// 	}
	// })
	// dirList.sort(sort)
	// return dirList.map((dirent) => dirent.name)
}

const goBack = () => {}
const forward = () => {}
const goUp = () => {}
const refresh = () => {}
const checkPath = () => {}
const goTo = (event: MouseEvent) => {}
</script>
