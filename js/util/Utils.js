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
}