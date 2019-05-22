import { AsyncStorage } from 'react-native';

export default class DataStore {
    // 保存数据
    saveData(url, data, cb) {
        if (!data || !url) {
            return
        }
        AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), cb)
    }
    _wrapData(data) {
        return {
            data: data,
            timestamp: new Date().getTime()
        }
    }
    // 获取数据
    fetchLocalData(url) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(url, (err, res) => {
                if (!err) {
                    try {
                        resolve(JSON.parse(res))
                    } catch (e) {
                        reject(e)
                        console.error(e)
                    }
                } else {
                    reject(err)
                    console.error(err)
                }
            })
        })
    }
    fetchNetData(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(res => {
                    if (res.ok) {
                        return res.json()
                    }
                    throw new Error('Network response is not ok')
                })
                .then(res => {
                    this.saveData(url, res)
                    resolve(res)
                })
                .catch(err => {
                    reject(err)
                })
        })
    }
    fetchData(url) {
        return new Promise((resolve, reject) => {
            this.fetchLocalData(url)
                .then(wrapData => {
                    if (wrapData && DataStore.checkTimestampValid(wrapData.timestamp)) {
                        resolve(wrapData)
                    } else {
                        this.fetchNetData(url)
                            .then(data => {
                                resolve(this._wrapData(data))
                            }).catch(error => {
                                reject(error)
                            })
                    }
                }).catch(error => {
                    this.fetchNetData(url)
                        .then(data => {
                            resolve(this._wrapData(data))
                        }).catch(error => {
                            reject(error)
                        })
                })
        })
    }

    static checkTimestampValid(timestamp) {
        const currentDate = new Date()
        const targetDate = new Date()

        targetDate.setTime(timestamp)
        if (currentDate.getMonth() !== targetDate.getMonth()) return false
        if (currentDate.getDate() !== targetDate.getDate()) return false
        if (currentDate.getHours() - targetDate.getHours() > 4) return false

        return true
    }
}