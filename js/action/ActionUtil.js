import ProjectModel from '../model/ProjectModel'
import Utils from '../util/Utils'

// 处理下拉刷新的数据
export function handleData(actionType, dispatch, storeName, data, pageSize, favoriteDao) {
    let fixItems = []
    if (data && data.data) {
        if (Array.isArray(data.data)) {
            fixItems = data.data
        } else if (Array.isArray(data.data.items)) {
            fixItems = data.data.items
        }
    }
    // 第一次加载的数据
    let showItems = pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize)
    _projectModels(showItems, favoriteDao, projectModels => {
        dispatch({
            type: actionType,
            items: fixItems,
            storeName,
            projectModels,
            pageIndex: 1,
            hideLoadingMore: pageSize > fixItems.length ? false : true
        })
    })


}

export async function _projectModels(showItems, favoriteDao, callback) {
    let keys = []
    try {
        // 获取收藏的keys
        keys = await favoriteDao.getFavoriteKeys()
        // if(keys){
        //     keys = JSON.parse(keys)
        // }
    } catch (error) {
        console.log(error);
    }
    let projectModels = []
    for (let i = 0, len = showItems.length; i < len; i++) {
        projectModels.push(new ProjectModel(showItems[i], Utils.checkFavorite(showItems[i], keys)))
    }
    if (typeof callback === 'function') {
        callback(projectModels)
    }
}