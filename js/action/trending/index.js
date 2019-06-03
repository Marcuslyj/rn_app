import Types from '../types'
import DataStore, { FLAG_STORAGE } from '../../expand/dao/DataStore'
import { handleData, _projectModels } from '../ActionUtil'

export const onRefreshTrending = (storeName, url, pageSize, favoriteDao) => dispatch => {
    dispatch({
        type: Types.TRENDING_REFRESH,
        storeName: storeName
    })
    let dataStore = new DataStore()
    dataStore.fetchData(url, FLAG_STORAGE.flag_trending)
        .then(data => {
            handleData(Types.TRENDING_REFRESH_SUCCESS, dispatch, storeName, data, pageSize, favoriteDao)
        })
        .catch(error => {
            console.log(error)
            dispatch({
                type: Types.TRENDING_REFRESH_FAIL,
                storeName,
                error,
                pageIndex: 1
            })
        })
}

export function onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray = [], favoriteDao, cb) {
    return dispatch => {
        setTimeout(() => {
            if ((pageIndex - 1) * pageSize >= dataArray.length) {
                if (typeof cb === 'function') {
                    cb('no more data')
                }
                dispatch({
                    type: Types.TRENDING_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName: storeName,
                    pageIndex: --pageIndex,
                    projectModels: dataArray
                })
            } else {
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex
                _projectModels(dataArray.slice(0, max), favoriteDao, projectModels => {
                    dispatch({
                        type: Types.TRENDING_LOAD_MORE_SUCCESS,
                        storeName,
                        pageIndex,
                        projectModels,
                        items: dataArray
                    })
                })
            }
        }, 500)
    }
}