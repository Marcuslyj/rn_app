import AsyncStorage from '@react-native-community/async-storage';

const FAVORITE_KEY_PREFIX = 'FAVORITE_KEY_PREFIX'
export default class FavoriteDao {
    // flag区分最热、趋势模块
    constructor(flag) {
        this.favoriteKey = FAVORITE_KEY_PREFIX + flag
    }
    /**
     * 收藏项目
     * @param {*} key 
     * @param {*} value 
     * @param {*} callback 
     */
    saveFavoriteItem(key, value, callback) {
        AsyncStorage.setItem(key, value, (error, result) => {
            if (!error) {// 更新favorite的key
                this.updateFavoriteKeys(key, true)
            }
        })
    }
    /**
     * 更新favorite key集合
     * @param {*} key 
     * @param {*} isAdd 
     */
    updateFavoriteKeys(key, isAdd) {
        AsyncStorage.getItem(this.favoriteKey, (error, result) => {
            if (!error) {
                let favoriteKeys = []
                if (result) {
                    favoriteKeys = JSON.parse(result)
                }
                let index = favoriteKeys.indexOf(key)
                if (isAdd) {
                    if (index === -1) {
                        favoriteKeys.push(key)
                    }
                } else {
                    if (index !== -1) {
                        favoriteKeys.splice(index, 1)
                    }
                }
                AsyncStorage.setItem(this.favoriteKey, JSON.stringify(favoriteKeys))
            }
        })
    }
    /**
     * 获取收藏的key
     */
    getFavoriteKeys() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(this.favoriteKey, (error, result) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(result))
                    } catch (e) {
                        reject(error)
                    }
                } else {
                    reject(error)
                }
            })
        })
    }
    /**
     * 取消收藏
     * @param {*} key 
     */
    removeFavoriteItem(key) {
        AsyncStorage.removeItem(key, (error, result) => {
            if (!error) {
                this.updateFavoriteKeys(key, false)
            }
        })
    }
    /**
     * 获取所有收藏
     */
    getAllItems() {
        return new Promise((resolve, reject) => {
            this.getFavoriteKeys()
                .then(keys => {
                    let items = []
                    if (keys) {
                        AsyncStorage.multiGet(keys, (error, stores) => {
                            try {
                                stores.map((result, i, store) => {
                                    let key = store[i][0];
                                    let value = store[i][1];
                                    if (value) items.push(JSON.parse(value));
                                })
                                resolve(items)
                            } catch (e) {
                                reject(e)
                            }
                        })
                    } else {
                        resolve(items)
                    }
                })
                .catch(e => {
                    reject(e)
                })
        })
    }
}