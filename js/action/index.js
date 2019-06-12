import { onThemeChange, onThemeInit, onShowCustomThemeView } from './theme'
import { onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite } from './popular'
import { onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite } from './trending'
import { onLoadFavoriteData } from './favorite'
import { onLoadLanguage } from './language'
import { onSearch, onSearchCancel, onLoadMoreSearch } from './search';

export default {
    /**
     * 主题
     */
    onThemeChange,
    onThemeInit,
    onShowCustomThemeView,
    /**
     * popular
     */
    onRefreshPopular,
    onLoadMorePopular,
    onFlushPopularFavorite,
    /**
     * trending
     */
    onRefreshTrending,
    onLoadMoreTrending,
    onLoadFavoriteData,
    onFlushTrendingFavorite,
    /**
     * 自定义语言
     */
    onLoadLanguage,
    /**
     * 搜索
     */
    onSearch,
    onSearchCancel,
    onLoadMoreSearch
}