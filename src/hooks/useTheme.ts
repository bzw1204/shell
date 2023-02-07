export default function useTheme(theme: string) {
    window.document.documentElement.setAttribute('nx-theme', theme)
}