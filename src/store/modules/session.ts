import { defineStore } from 'pinia'

export interface ISession {
    group: {
        value: number
        label: string
    }[]
}

const useSessionStore = defineStore('create-session', {
    state: (): ISession => ({
        group: [],
    }),
    actions: {
        updateGroup(group: []) {
            this.group = group
            this.group.splice(0, 0, {
                value: 0,
                label: '无'
            })
        }
    }
})

export default useSessionStore