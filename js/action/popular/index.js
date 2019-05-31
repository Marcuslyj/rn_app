import Types from '../types'
import DataStore, { FLAG_STORAGE } from '../../expand/dao/DataStore'
import { handleData } from '../ActionUtil';

export const onRefreshPopular = (storeName, url, pageSize) => dispatch => {
    dispatch({
        type: Types.POPULAR_REFRESH,
        storeName: storeName
    })
    let dataStore = new DataStore()
    dataStore.fetchData(url, FLAG_STORAGE.flag_popular)
        .then(data => {
            handleData(Types.POPULAR_REFRESH_SUCCESS, dispatch, storeName, data, pageSize)
        })
        .catch(error => {
            console.log(error)
            dispatch({
                type: Types.POPULAR_REFRESH_FAIL,
                storeName,
                error,
                pageIndex: 1
            })
        })
}

export function onLoadMorePopular(storeName, pageIndex, pageSize, dataArray = [], cb) {
    return dispatch => {
        setTimeout(() => {
            if ((pageIndex - 1) * pageSize >= dataArray.length) {
                if (typeof cb === 'function') {
                    cb('no more data')
                }
                dispatch({
                    type: Types.POPULAR_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName: storeName,
                    pageIndex: --pageIndex,
                    projectModels: dataArray
                })
            } else {
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex
                dispatch({
                    type: Types.POPULAR_LOAD_MORE_SUCCESS,
                    storeName,
                    pageIndex,
                    projectModels: dataArray.slice(0, max),
                    items: dataArray
                })
            }
        }, 500)
    }
}