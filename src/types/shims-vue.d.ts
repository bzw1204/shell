declare module '*.vue' {
    import { ComponentOptions } from 'vue'

    interface Vue {
        $sessionManager: any
    }

    const componentOptions: ComponentOptions<any>
    export default componentOptions

}

// *.d.ts文件中
// declare interface Window {
//     powertools: Record<any, any>
// }