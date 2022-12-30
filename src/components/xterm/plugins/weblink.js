import { WebLinksAddon } from 'xterm-addon-web-links'

new WebLinksAddon((event, uri) => {
        if (!event.ctrlKey) {
            return
        }
        this.$emit('link', uri)
    },

    {
        tooltipCallback: (evt, uri, location) => {
            const { actualCellWidth, actualCellHeight } = this.terminal._core._renderService.dimensions

            // show tip
            this.urlTip = uri
            this.urlTipPosition.left = location.start.x * actualCellWidth
            let top = location.start.y * actualCellHeight - 30
            if (top < 0) {
                top = location.start.y * actualCellHeight + 30
            }
            this.urlTipPosition.top = top
        },
        leaveCallback: () => {
            // hide tip
            this.urlTip = ''
        },
        willLinkActivate(evt, uri) {
            return evt.ctrlKey
        }
    }
)