import { applyMiddleware, createStore } from 'redux'
import reducers from '../reducer'
import { middleware } from '../navigator/AppNavigator'

// 自定义中间件
const logger = store => next => action => {
    if (typeof action === 'function') {
        // console.log('disapatching a function');
    } else {
        // console.log('dispatching ', action);
    }
    const result = next(action)
    // console.log('nextState ', store.getState());
}

const middlewares = [
    middleware,
    logger
]

// 创建store
export default createStore(reducers, applyMiddleware(...middlewares))







