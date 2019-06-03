import Types from '../types'
import DataStore, { FLAG_STORAGE } from '../../expand/dao/DataStore'
import { handleData, _projectModels } from '../ActionUtil';

export const onRefreshPopular = (storeName, url, pageSize, favoriteDao) => dispatch => {
    dispatch({
        type: Types.POPULAR_REFRESH,
        storeName: storeName
    })
    let dataStore = new DataStore()
    dataStore.fetchData(url, FLAG_STORAGE.flag_popular)
        .then(data => {
            handleData(Types.POPULAR_REFRESH_SUCCESS, dispatch, storeName, data, pageSize, favoriteDao)
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

export function onLoadMorePopular(storeName, pageIndex, pageSize, dataArray = [], favoriteDao, callback) {
    return dispatch => {
        setTimeout(() => {
            if ((pageIndex - 1) * pageSize >= dataArray.length) {
                if (typeof callback === 'function') {
                    callback('no more data')
                }
                dispatch({
                    type: Types.POPULAR_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName: storeName,
                    pageIndex: --pageIndex,
                    items: dataArray
                })
            } else {
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex
                _projectModels(dataArray.slice(0, max), favoriteDao, projectModels => {
                    dispatch({
                        type: Types.POPULAR_LOAD_MORE_SUCCESS,
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