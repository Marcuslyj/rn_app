export default class ArrayUtil {
    static isEqual(arr1, arr2) {
        if (!(arr1 && arr2)) return false
        if (arr1.length !== arr2.length) return false

        for (let i = 0, l = arr1.length; i < l; i++) {
            if (arr1[i] !== arr[i]) return false
        }
        return true
    }

    /**
     * 更新数组,若item已存在则将其从数组中删除,若不存在则将其添加到数组
     * **/
    static updateArray(array, item) {
        for (let i = 0, len = array.length; i < len; i++) {
            let temp = array[i];
            if (item === temp) {
                array.splice(i, 1);
                return;
            }
        }
        array.push(item);
    }
}