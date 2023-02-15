<template>
	<el-dialog
		:title="t('components.auth.title')"
		:visible="visible"
		append-to-body
		width="80%"
		:show-close="false"
		:destroy-on-close="false"
		:close-on-click-modal="false"
	>
		<el-form
			ref="sshSubFormRef"
			:form="sshSubForm"
			class="n-session-ssh-container"
			label-position="top"
			label-width="80px"
		>
			<div class="n-session-ssh-container__left">
				<el-form-item :label="t('home.profile.base.host-name.title')">
					<el-input v-model="sshSubForm.hostName" />
				</el-form-item>
				<el-form-item label="分组">
					<el-select v-model="sshSubForm.group" placeholder="请选择分组" style="width: 100%">
						<el-option v-for="item in group" :label="item.label" :value="item.value" :key="item.value" />
					</el-select>
				</el-form-item>
			</div>
			<div class="n-session-ssh-container__right">
				<el-tabs v-model="activeTab">
					<el-tab-pane label="通用" name="base">
						<el-row :gutter="5">
							<el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
								<el-form-item label="链接类型">
									<el-input v-model="sshSubForm.host" placeholder="请选择链接类型" />
								</el-form-item>
							</el-col>
							<el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="15">
								<el-form-item label="主机地址">
									<el-input v-model="sshSubForm.host" placeholder="请输入主机地址" />
								</el-form-item>
							</el-col>
							<el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="4">
								<el-form-item label="端口">
									<el-input-number v-model="sshSubForm.port" placeholder="请输入端口" />
								</el-form-item>
							</el-col>
						</el-row>
						<el-radio-group v-model="authMethod">
							<el-radio-button :label="1">密码</el-radio-button>
							<el-radio-button :label="2">密钥</el-radio-button>
							<el-radio-button :label="3">键盘</el-radio-button>
						</el-radio-group>
						<el-row :gutter="5">
							<el-col :span="12">
								<el-form-item label="用户名">
									<el-input v-model="sshSubForm.host" placeholder="请输入用户名" />
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item v-if="authMethod === 1" label="密码">
									<el-input v-model="sshSubForm.host" placeholder="请输入用户名" />
								</el-form-item>
								<el-form-item v-if="authMethod === 2" label="密钥">
									<el-input v-model="sshSubForm.host" placeholder="请输入用户名" />
								</el-form-item>
							</el-col>
						</el-row>
					</el-tab-pane>
					<el-tab-pane label="端口" name="second">
						<div class="port-container">
							<el-input placeholder="127.0.0.1" />
							<el-input-number :min="1" :max="65535" />
							<span class="port-container-link">
								<i class="el-icon-right"></i>
							</span>
							<el-input placeholder="127.0.0.1" />
							<el-input-number :min="1" :max="65535" />
						</div>
					</el-tab-pane>
					<el-tab-pane label="高级" name="third">高级</el-tab-pane>
					<el-tab-pane label="主题" name="fourth">主题</el-tab-pane>
				</el-tabs>
			</div>
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button @click="handleCancel">{{ t('components.Cancel') }}</el-button>
			<el-button type="primary" @click="handleOk">{{ t('components.OK') }}</el-button>
		</div>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSessionStore } from '@/store/pinia'
import { useI18n } from 'vue-i18n-bridge'

const { t } = useI18n()
const visible = ref(false)
const title = ref('')
const sshSubForm = ref({
	hostName: '',
	group: '',
	host: '',
	port: 80
})
const activeTab = ref('base')
const authMethod = ref(1)
const emits = defineEmits(['cancel', 'ok'])
const { group } = storeToRefs(useSessionStore())
const showModal = () => {
	visible.value = true
}
const handleCancel = () => {
	visible.value = false
	emits('cancel')
}
const handleOk = () => {
	visible.value = false
	emits('ok')
}
defineExpose({
	showModal
})
</script>

<style lang="scss" scoped>
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

		.n-base-host {
			display: flex;
			column-gap: 5px;
		}

		.port-container {
			display: flex;
			justify-content: space-between;
			align-items: center;
			column-gap: 3px;

			&-link {
				flex: 1;
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 0 10px;
			}
		}
	}
}
</style>
