import { combineReducers } from 'redux'
import { rootCom, RootNavigator } from '../navigator/AppNavigator'
import theme from './theme/index'
import popular from './popular/index';
import trending from './trending/index'
import favorite from './favorite'

// 指定默认state
const navState = RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams(rootCom))

// 创建自己的navigation reducer
const navReducer = (state = navState, action) => {
    const nextSate = RootNavigator.router.getStateForAction(action, state)
    return nextSate || state
}

// 合并reducer
const index = combineReducers({
    nav: navReducer,
    theme,
    popular,
    trending,
    favorite
})

export default index












