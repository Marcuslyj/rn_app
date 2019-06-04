import Types from '../types'
import DataStore, { FLAG_STORAGE } from '../../expand/dao/DataStore'
import { handleData, _projectModels } from '../ActionUtil'
import FavoriteDao from '../../expand/dao/FavoriteDao'
import ProjectModel from '../../model/ProjectModel';

export const onLoadFavoriteData = (flag) => dispatch => {
    dispatch({
        type: Types.FAVORITE_LOAD_DATA,
        storeName: flag
    })

    let favoriteDao = new FavoriteDao(flag)

    favoriteDao.getAllItems()
        .then(items => {
            let resultData = []
            for (let i = 0, len = items.length; i < len; i++) {
                resultData.push(new ProjectModel(items[i], true))
            }
            dispatch({
                type: Types.FAVORITE_LOAD_SUCCESS,
                projectModels: resultData,
                storeName: flag
            })
        })
        .catch(error => {
            console.log(error);
            dispatch({
                type: Types.FAVORITE_LOAD_FAIL,
                error,
                storeName: flag
            })
        })
}