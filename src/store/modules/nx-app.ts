import { defineStore } from 'pinia'
// @ts-ignore
import * as globalSetting from '@/services/globalSetting';

export interface AppProps {
    theme: string
    userLock: boolean
    noCloseConfirm: boolean,
    language: string
    configPanel: boolean
}

const useAppStore = defineStore('app', {
    state: (): AppProps => ({
        theme: globalSetting.getProfile('xterm')?.theme as string ?? 'light',
        userLock: false,
        noCloseConfirm: false,
        language: globalSetting.getProfile('xterm')?.language as string ?? 'zh-CN',
        configPanel: true
    }),
    getters: {
        getTheme: () => globalSetting.getProfile('xterm')?.theme
    },
    actions: {
        async changeTheme(theme: string) {
            const defaultSettings = globalSetting.getProfile("xterm")
            await globalSetting.updateProfile("xterm", { ...defaultSettings, theme: theme }).then(() => {
                this.theme = theme;
                window.document.documentElement.setAttribute('nx-theme', theme)
            })
        },
        changeLanguage(language: string) {
            this.language = language
        }
    }
})

export default useAppStore