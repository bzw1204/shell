<template>
	<el-dialog
		title="Serial 会话"
		:visible="visible"
		append-to-body
		width="70%"
		:show-close="false"
		:destroy-on-close="false"
		:close-on-click-modal="false"
		@close="handlerClose"
	>
		<el-form
			ref="telnetFormRef"
			:model="sessionForm"
			:rules="telnetFormRules"
			class="n-session-ssh-container"
			label-position="top"
			label-width="80px"
		>
			<div class="n-session-ssh-container__left">
				<el-form-item :label="t('home.profile.base.host-name.title')" prop="hostName">
					<el-input
						v-model="sessionForm.hostName"
						:placeholder="t('home.profile.base.host-name.placeholder')"
					/>
				</el-form-item>
				<el-form-item :label="t('home.profile.base.host-name.title')" prop="system">
					<n-space>
						<el-autocomplete
							v-model="sessionForm.system"
							value-key="icon"
							:fetch-suggestions="querySearch"
							clearable
							placeholder="请输入内容"
						/>
						<n-icon :name="sessionForm.system" size="24" />
					</n-space>
				</el-form-item>
				<el-form-item :label="t('home.profile.base.host-group.title')" prop="group">
					<el-select
						v-model="sessionForm.group"
						:placeholder="t('home.profile.base.host-group.placeholder')"
						style="width: 100%"
					>
						<el-option
							v-for="(item, index) in group"
							:label="item.label"
							:value="item.value"
							:key="index"
						/>
					</el-select>
				</el-form-item>
			</div>
			<div class="n-session-ssh-container__right">
				<el-tabs v-model="activeTab" type="border-card">
					<!-- 通用 -->
					<el-tab-pane :label="t('components.session.base.label')" name="base">
						<el-row :gutter="10">
							<el-col :span="12">
								<!-- 端口 -->
								<el-form-item :label="$t('home.profile.serial.port.title')" prop="port">
									<el-select v-model="sessionForm.port">
										<el-option v-for="(item, index) in serialPorts" :value="item" :key="index">
											{{ item }}
										</el-option>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<!-- 主机 -->
								<el-form-item :label="$t('home.profile.serial.baudRate.title')" prop="baudRate">
									<el-select v-model="sessionForm.baudRate" allow-create filterable>
										<el-option
											v-for="item in baudRateOptions"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										/>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="10">
							<el-col :span="12">
								<!-- 数据位 -->
								<el-form-item :label="$t('home.profile.serial.dataBits.title')" prop="dataBits">
									<el-select v-model="sessionForm.dataBits">
										<el-option
											v-for="item in dataBitsOptions"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										/>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<!-- 停止位 -->
								<el-form-item :label="$t('home.profile.serial.stopBits.title')" prop="stopBits">
									<el-select v-model="sessionForm.stopBits">
										<el-option
											v-for="item in stopBitsOptions"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										/>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row :gutter="10">
							<el-col :span="12">
								<!-- 主机 -->
								<el-form-item :label="$t('home.profile.serial.parity.title')" prop="parity">
									<el-select v-model="sessionForm.parity">
										<el-option
											v-for="item in parityOptions"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										/>
									</el-select>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<!-- 流控方式 -->
								<el-form-item :label="$t('home.profile.serial.flowControl.title')" prop="flowControl">
									<el-select v-model="sessionForm.flowControl">
										<el-option
											v-for="item in flowControlOptions"
											:key="item.value"
											:label="item.label"
											:value="item.value"
										/>
									</el-select>
								</el-form-item>
							</el-col>
						</el-row>
					</el-tab-pane>
					<!-- 主题 -->
					<el-tab-pane :label="t('components.session.theme.label')" name="theme">
						<div class="n-theme-form">
							<template v-for="item in configItems">
								<el-row :title="t(item.description)" class="item">
									<el-col :span="6">
										<label>{{ t(item.title) }}</label>
									</el-col>
									<el-col :offset="3" :span="14">
										<el-input
											v-model="sessionForm[item.name]"
											v-if="['text', 'password'].includes(item.type)"
											:type="item.type"
										/>
										<el-input-number
											v-model="sessionForm[item.name]"
											v-if="item.type === 'number'"
											:step="item.step"
											:min="1"
											controls-position="right"
											style="width: 100%"
										/>
										<el-switch v-model="sessionForm[item.name]" v-if="item.type === 'switch'" />
										<el-radio-group
											v-if="item.type === 'radio-group'"
											v-model="sessionForm[item.name]"
										>
											<el-radio-button
												v-for="(r, index) in item.options"
												:label="r.value"
												:key="index"
											>
												{{ r.label }}
											</el-radio-button>
										</el-radio-group>
										<el-select
											v-model="sessionForm[item.name]"
											v-if="item.type === 'select'"
											style="width: 100%"
										>
											<el-option
												v-for="(opt, idx) in item.options"
												:key="idx"
												:label="t(opt.label)"
												:value="opt.value"
											/>
										</el-select>
									</el-col>
								</el-row>
							</template>
							<div class="item theme">
								<xtermThemeList :value.sync="sessionForm.xtermTheme" :theme-options="sessionForm" />
							</div>
						</div>
					</el-tab-pane>
				</el-tabs>
			</div>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="handlerClose">{{ t('components.Cancel') }}</el-button>
			<el-button type="primary" @click="handleOk">{{ t('components.OK') }}</el-button>
			<el-button type="primary" @click="handleSaveAndConnect">
				{{ t('home.profile.operator.save-conn') }}
			</el-button>
		</div>
	</el-dialog>
</template>
<script setup>
import { getCurrentInstance, onMounted, ref } from 'vue'
import { querySearch } from '@/icons/system-icon'
import { publish } from '@/services/eventbus'
import { SESSION_CONFIG_TYPE, SessionConfig } from '@/services/sessionMgr'
import { useSessionStore } from '@/store'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n-bridge'
import {
	baudRateOptions,
	dataBitsOptions,
	defaultForm,
	flowControlOptions,
	parityOptions,
	stopBitsOptions
} from './constants'
import { initDefaultThemeOptions } from '../constants'
import xtermThemeList from '@/views/session/components/xtermTheme/index.vue'

const { configItems, formItem } = initDefaultThemeOptions()
const { t } = useI18n()
const emits = defineEmits(['ok', 'cancel'])
const visible = ref(false)
const telnetFormRef = ref()
const sessionForm = ref({ ...defaultForm, ...formItem })
const telnetFormRules = {
	hostName: [{ required: true, message: '请输入会话名称', trigger: 'blur' }],
	host: [{ required: true, message: '请输入主机地址', trigger: 'blur' }],
	hostTelnetPort: [{ required: true, message: '请输入主机端口', trigger: 'blur' }]
}
const sessionStore = useSessionStore()
const { group } = storeToRefs(sessionStore)
const activeTab = ref('base')
const serialPorts = ref([])
const isEdit = ref(false)
const proxy = getCurrentInstance().proxy
const sessionManager = proxy.$sessionManager
const sessionConfig = ref()
const sessionInstance = ref()

const showModal = async (sessionId) => {
	if (sessionId) {
		isEdit.value = true
		sessionConfig.value = sessionManager.getSessionConfigById(sessionId)
		sessionInstance.value = sessionManager.getSessionInstanceById(sessionId)
		// 移除旧会话中无用属性
		const newFormKeys = Object.keys(sessionForm.value)
		const oldFormKeys = Object.keys(sessionConfig.value.config)
		// 删除oldFormKeys 中不在newFormKeys中的属性
		for (let i = 0, len = oldFormKeys.length; i < len; i++) {
			const key = oldFormKeys[i]
			if (!newFormKeys.includes(key)) {
				delete sessionConfig.value[key]
			}
		}
		sessionForm.value = { ...sessionForm.value, ...sessionConfig.value.config }
	}
	// 创建会话配置
	sessionConfig.value = new SessionConfig(
		sessionForm.value.hostName,
		SESSION_CONFIG_TYPE.NODE,
		sessionForm.value,
		'telnet session'
	)
	visible.value = true
}

const saveOrUpdateSession = () => {
	const sessionName = sessionForm.value.hostName
	if (isEdit.value) {
		// 更新配置信息
		sessionConfig.value.update(sessionName, Object.assign(sessionConfig.value.config, sessionForm.value), '')
	} else {
		// 创建会话配置
		sessionConfig.value = new SessionConfig(
			sessionName,
			SESSION_CONFIG_TYPE.NODE,
			sessionForm.value,
			'telnet session'
		)
		// 添加会话配置
		sessionStore.appendSessionConfig(sessionConfig.value)
	}
	// 刷新菜单
	publish('refresh-session-tree')
}

const handleOk = () => {
	telnetFormRef.value.validate((valid) => {
		if (!valid) {
			return false
		}
		saveOrUpdateSession()
		emits('ok', sessionForm.value)
		visible.value = false
	})
}

const handleSaveAndConnect = () => {
	telnetFormRef.value.validate((valid) => {
		if (!valid) {
			return false
		}
		saveOrUpdateSession()
		sessionManager.createSessionInstance(sessionConfig.value)
		emits('ok', sessionForm.value)
		visible.value = false
	})
}

const handlerClose = () => {
	isEdit.value = false
	activeTab.value = 'base'
	sessionConfig.value = undefined
	sessionForm.value = { ...defaultForm }
	telnetFormRef.value?.clearValidate()
	visible.value = false
}

onMounted(() => {
	powertools.getService().getSerialPorts().then(res => {
		serialPorts.value = res.map(x => x.path).sort()
	})
})
defineExpose({ showModal })
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
	height: 400px;
}

.n-session-ssh-container {
	display: flex;
	justify-content: space-between;
	column-gap: 10px;

	&__left {
		width: 30%;
		padding-top: 12px;
	}

	&__right {
		flex: 1;

		.n-port-forward {
			display: flex;
			column-gap: 5px;
			justify-content: space-between;
			width: 100%;

			&__source,
			&__target {
				flex: 1;
				display: inline-flex;
				column-gap: 5px;
			}
		}

		.n-theme-form {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			grid-gap: 10px;
			padding-right: 10px;
			max-height: 340px;
			grid-template-areas: 'normal theme';

			.theme {
				grid-area: theme;
				grid-column: 2 / span 1;
				grid-row: 1 / span 5;
				max-height: 255px;
			}
		}
	}
}
</style>
