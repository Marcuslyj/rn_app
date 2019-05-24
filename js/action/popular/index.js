import Types from '../types'
import DataStore from '../../expand/dao/DataStore'

export const onRefreshPopular = (storeName, url, pageSize) => dispatch => {
    dispatch({
        type: Types.POPULAR_REFRESH,
        storeName: storeName
    })
    let dataStore = new DataStore()
    dataStore.fetchData(url)
        .then(data => {
            handleData(dispatch, storeName, data, pageSize)
        })
        .catch(error => {
            console.log(error)
            dispatch({
                type: Types.POPULAR_FRESH_FAIL,
                storeName,
                error,
                pageIndex: 1
            })
        })
}

function handleData(dispatch, storeName, data, pageSize) {
    let fixItems = []
    if (data && data.data && data.data.items) {
        fixItems = data.data.items
    }
    // console.log('@@@@@@@@@@@@@@@@@@');
    // console.log({
    //     type: Types.POPULAR_FRESH_SUCCESS,
    //     items: data && data.data && data.data.items,
    //     storeName,
    //     projectModes: pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize),// 第一次加载
    //     pageIndex: 1
    // });
    // console.log('====================================');
    dispatch({
        type: Types.POPULAR_FRESH_SUCCESS,
        items: fixItems,
        storeName,
        projectModes: pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize),// 第一次加载
        pageIndex: 1,
        hideLoadingMore: pageSize > fixItems.length ? false : true
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
                    projectModes: dataArray
                })
            } else {
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex
                dispatch({
                    type: Types.POPULAR_FRESH_SUCCESS,
                    storeName,
                    pageIndex,
                    projectModes: dataArray.slice(0, max),
                    items: dataArray
                })
            }
        }, 500)
    }
}