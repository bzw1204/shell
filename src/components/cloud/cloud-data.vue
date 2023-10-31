<template>
		<el-dialog title="云端同步" width="400px" :visible.sync="dialogTableVisible" :close-on-click-modal="false"
		           append-to-body>
				<el-alert title="每次同步采用覆盖方式，请谨慎操作！" type="warning" :closable="false" />
				<el-form ref="syncCloudForm" :model="webdavForm" :rules="rules">
						<el-form-item label="云地址" prop="url">
								<el-input v-model="webdavForm.url" autocomplete="off">
										<template slot="append">/nx-shell</template>
								</el-input>
						</el-form-item>
						<el-form-item label="用户名" prop="username">
								<el-input v-model="webdavForm.username" autocomplete="off"></el-input>
						</el-form-item>
						<el-form-item label="授权码" prop="password">
								<el-input v-model="webdavForm.password" type="password" show-password autocomplete="off"></el-input>
						</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
						<el-button type="primary" @click="saveWebdav">保存</el-button>
						<el-button type="primary" @click="checkWebdav">测试链接</el-button>
						<el-button type="primary" @click="rsyncRemote">同步到云端</el-button>
						<el-button type="primary" @click="rsyncLocal">同步到本地</el-button>
				</div>
		</el-dialog>
</template>

<script setup>
import { getCurrentInstance, reactive, ref } from "vue"
import Storage from "../../services/storage"
import { createClient } from "webdav"
import { useSessionStore } from "@/store"
import { publish } from "@/services/eventbus"

const syncCloudForm = ref()
const dialogTableVisible = ref(false)
const sessionStore = useSessionStore()
const webdavForm = reactive({
		url: "",
		username: "",
		password: ""
})
const rules = {
		url: [{ required: true, message: "请输入WebDav服务器地址", trigger: "blur" }],
		username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
		password: [{ required: true, message: "请输入授权码", trigger: "blur" }]
}
const proxy = getCurrentInstance()?.proxy
const show = async () => {
		const config = await Storage.read("webdav")
		if (config) {
				webdavForm.url = config.url
				webdavForm.username = config.username
				webdavForm.password = config.password
		}

		dialogTableVisible.value = true
}
const clientWebdav = ref()
// 初始化
const initWebdav = async () => {
		syncCloudForm.value?.validate(async (valid) => {
				if (valid) {
						try {
								clientWebdav.value = createClient(webdavForm.url, {
										username: webdavForm.username,
										password: webdavForm.password
								})
								const exist = await clientWebdav.value.exists("/nx-shell")
								!exist && (await clientWebdav.value.createDirectory("/nx-shell"))
						} catch (error) {
								proxy?.$message.warning("服务器链接失败！")
								console.error("服务器链接失败！", error)
						}
				} else {
						proxy?.$message.warning("请补全同步盘配置信息")
						return false
				}
		})
}

const readConfig = async () => {
		return await Storage.read("SESSIONS")
}
// 保存
const saveWebdav = async () => {
		try {
				await Storage.save("webdav", webdavForm, true)
				proxy?.$message.success("保存成功")
		} catch (err) {
				proxy?.$message.error(`保存失败:${ err }`)
		}
}

// 校验
const checkWebdav = async () => {
		try {
				if (!clientWebdav.value) {
						await initWebdav()
				}
				await clientWebdav.value.getDirectoryContents("/")
				proxy?.$message.success("连接成功")
		} catch (err) {
				proxy?.$message.error(`连接失败:${ err }`)
		}
}

// 覆盖远端
const rsyncRemote = async () => {
		try {
				if (!clientWebdav.value) {
						await initWebdav()
				}
				// 这里再次判断解决因为初始化过一次后，删除目录导致传输失败
				const exist = await clientWebdav.value.exists("/nx-shell")
				!exist && (await clientWebdav.value.createDirectory("/nx-shell"))
				const str = await readConfig()
				const formatToJson = JSON.stringify(str)
				await clientWebdav.value.putFileContents("/nx-shell/config.json", formatToJson, {
						overwrite: true,
						contentLength: true
				})
				proxy?.$message.success("传输成功")
		} catch (err) {
				proxy?.$message.error(`传输失败:${ err }`)
				console.error(err)
		}
}

// 覆盖本地
const rsyncLocal = async () => {
		try {
				if (!clientWebdav.value) {
						await initWebdav()
				}
				const exist = await clientWebdav.value.exists("/nx-shell/config.json")
				if (exist) {
						const str = await clientWebdav.value.getFileContents("/nx-shell/config.json", { format: "text" })
						const formatToJson = JSON.parse(str)
						await Storage.save("SESSIONS", formatToJson, true)
						publish("nx-config-sync")
						proxy?.$message.success("配置同步成功！")
				} else {
						proxy?.$message.error("未发现远端配置文件！")
				}
		} catch (err) {
				proxy?.$message.error(`获取文件失败:${ err }`)
				console.error(err)
		}
}
defineExpose({ show })
</script>
