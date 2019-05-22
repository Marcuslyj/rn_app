import Types from '../types'
import DataStore from '../../expand/dao/DataStore'

export const onLoadPopularData = (storeName, url) => dispatch => {
    dispatch({
        type: Types.POPULAR_REFRESH,
        payload: storeName
    })
    let dataStore = new DataStore()
    dataStore.fetchData(url)
        .then(data => {
            handleData(dispatch, storeName, data)
        })
        .catch(error => {
            console.log(error)
            dispatch({
                type: Types.POPULAR_LOAD_FAIL,
                storeName,
                error
            })
        })
}

function handleData(dispatch, storeName, data) {
    dispatch({
        type: Types.POPULAR_LOAD_SUCCESS,
        items: data && data.data && data.data.items,
        storeName
    })
}