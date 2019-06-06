import LanguageDao from "../../expand/dao/LanguageDao";
import Types from "../types";

/**
 * 加载标签
 * @param flag
 * @returns {function(*)}
 */
export function onLoadLanguage(flag) {
    return async dispatch => {
        try {
            let languages = await new LanguageDao(flag).fetch();
            dispatch({
                type: Types.LANGUAGE_LOAD_SUCCESS,
                languages,
                flag
            })
        } catch (e) {
            console.log(e)
        }
    }
}