import Types from '../../action/types'

const defaultState = {
    theme: 'orange'
}

export default function onAction(state = defaultState, action) {
    switch (action.type) {
        case Types.THEME_CHANGE:
            return {
                ...state,
                theme: action.payload
            }
        default:
            return state
    }
}