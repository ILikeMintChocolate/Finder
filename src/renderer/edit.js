import { get } from 'svelte/store'
import { editMode, currentSelectedFile, startKeyBoardEvent, stopKeyBoardEvent } from './state.js'

class Edit {
    constructor() {
        this.id = null
        this.rate = null
        this.tag = null
    }

    clearEdit() {
        this.id = null
        this.rate = null
        this.tag = null
    }

    startEdit() {
        editMode.set(true)
        this.clearEdit()
        stopKeyBoardEvent()
        this.id = get(currentSelectedFile).id
        this.rate = get(currentSelectedFile).rate
        this.tag = get(currentSelectedFile).tag.join(',')
    }

    finishEdit() {
        if (get(editMode)) {
            if (this.id != null) {
                let option = []
                if (this.rate != (document.getElementById('set-rate-wrapper').dataset.rate || 0))
                    option.push(['rate', document.getElementById('set-rate-wrapper').dataset.rate])
                if (this.tag != document.getElementById('edit-tag-input').value)
                    option.push([
                        'tag',
                        document
                            .getElementById('edit-tag-input')
                            .value.split(',')
                            .filter((t) => t != ''),
                    ])
                if (option.length)
                    window.electron.setMetadata({
                        id: this.id,
                        option: option,
                    })
            }
            editMode.set(false)
            this.clearEdit()
            startKeyBoardEvent()
        }
    }
}

export const edit = new Edit()
