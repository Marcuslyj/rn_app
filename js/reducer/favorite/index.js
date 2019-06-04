import Types from '../../action/types'

const defaultState = {}

export default function onAction(state = defaultState, action) {
    switch (action.type) {
        case Types.FAVORITE_LOAD_DATA://获取收藏数据
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: true,
                }
            }
        case Types.FAVORITE_LOAD_SUCCESS://获取收藏数据成功
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false,
                    projectModels: action.projectModels
                }
            }
        case Types.FAVORITE_LOAD_FAIL://获取收藏数据失败
            return {
                ...state,
                [action.storeName]: {
                    ...state[action.storeName],
                    isLoading: false
                }
            }
        default:
            return state
    }
}