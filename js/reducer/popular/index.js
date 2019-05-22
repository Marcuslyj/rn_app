import Types from '../../action/types'

const defaultState = {}

export default function onAction(state = defaultState, action) {
    switch (action.type) {
        case Types.POPULAR_LOAD_SUCCESS:
            return {
                ...state,
                [action.storeName]: {
                    ...[action.storeName],
                    items: action.items,
                    isLoading: false
                }
            }
        case Types.POPULAR_REFRESH:
            return {
                ...state,
                [action.storeName]: {
                    ...[action.storeName],
                    isLoading: false
                }
            }
        case Types.POPULAR_LOAD_FAIL:
            return {
                ...state,
                [action.storeName]: {
                    ...[action.storeName],
                    isLoading: false
                }
            }
        default:
            return state
    }
}