export default class Utils {
    static checkFavorite(item, keys = []) {
        if (!keys) return false
        for (let i = 0, len = keys.length; i < len; i++) {
            let id = String(item.id ? item.id : item.fullName)
            if (id === keys[i]) {
                return true
            }
        }
        return false
    }
    /**
     * 检查key是否存在于keys中
     * @param keys
     * @param key
     */
    static checkKeyIsExist(keys, key) {
        for (let i = 0, l = keys.length; i < l; i++) {
            if (key.toLowerCase() === keys[i].name.toLowerCase()) return true;
        }
        return false;
    }
}