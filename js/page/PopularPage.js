
import React, { Component } from 'react';
import { TouchableOpacity, DeviceInfo, ActivityIndicator, FlatList, StyleSheet, Text, View, Button, RefreshControl } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation'
import { connect } from 'react-redux'
import actions from '../action/index'
import PopularItem from '../common/PopularItem'
import Toast, { DURATION } from 'react-native-easy-toast'
import NavigationBar from '../common/NavigationBar'
import NavigationUtil from '../navigator/NavigationUtil';
import FavoriteDao from '../expand/dao/FavoriteDao';
import { FLAG_STORAGE } from '../expand/dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtil';
import EventBus from 'react-native-event-bus';
import EventTypes from '../util/EventTypes';
import { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';
import Ionicons from 'react-native-vector-icons/Ionicons'

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular)


class PopularPage extends Component {
    constructor(props) {
        super(props)
        const { onLoadLanguage } = this.props
        onLoadLanguage(FLAG_LANGUAGE.flag_key)
    }
    _genTabs() {
        const tabs = {}
        const { keys } = this.props
        keys.forEach((item, index) => {
            if (item.checked) {
                tabs[`tab${index}`] = {
                    screen: props => <PopularTabPage {...props} tabLabel={item.name} />,
                    navigationOptions: {
                        title: item.name
                    }
                }
            }
        })
        return tabs
    }
    renderRightButton() {
        const { theme } = this.props;
        return <TouchableOpacity
            onPress={() => {
                // AnalyticsUtil.track("SearchButtonClick");
                NavigationUtil.goPage({ theme }, 'SearchPage')
            }}
        >
            <View style={{ padding: 5, marginRight: 8 }}>
                <Ionicons
                    name={'ios-search'}
                    size={24}
                    style={{
                        marginRight: 8,
                        alignSelf: 'center',
                        color: 'white',
                    }} />
            </View>
        </TouchableOpacity>
    }
    render() {
        let { keys, theme } = this.props
        let statusBar = {
            backgroundColor: theme.themeColor,
            barStyle: 'light-content'
        }
        let navigationBar = (
            <NavigationBar
                title='最热'
                statusBar={statusBar}
                style={{ backgroundColor: theme.themeColor }}
                rightButton={this.renderRightButton()}
            />
        )
        const TabNavigator = keys.length ? createMaterialTopTabNavigator(
            this._genTabs(),
            {
                tabBarOptions: {
                    tabStyle: styles.tabStyle,
                    upperCaseLabel: false,
                    scrollEnabled: true,
                    style: {
                        backgroundColor: theme.themeColor,
                        height: 30 //fix 开启scrollEnabled时，高度异常
                    },
                    indicatorStyle: styles.indicatorStyle,
                    labelStyle: styles.labelStyle
                },
                lazy: true
            }
        ) : null;

        return (
            <View style={{ flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0 }}>
                {navigationBar}
                {TabNavigator && <TabNavigator />}
            </View>

        )
    }
}

const mapPopularStateToProps = state => ({
    keys: state.language.keys,
    theme: state.theme.theme
})

export default connect(
    mapPopularStateToProps,
    {
        onLoadLanguage: actions.onLoadLanguage
    }
)(PopularPage)

const pageSize = 10
class PopularTab extends Component {
    constructor(props) {
        super(props)
        const { tabLabel } = this.props
        this.storeName = tabLabel
        this.isFavoriteChanged = false
    }
    componentDidMount() {
        this.loadData()

        EventBus.getInstance().addListener(EventTypes.favorite_change_popular, this.favoriteChangeListener = () => {
            this.isFavoriteChanged = true
        })

        EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = data => {
            if (data.to === 0 && this.isFavoriteChanged) {
                this.loadData(null, true)
            }
        })
    }
    componentWillUnmount() {
        this.favoriteChangeListener && EventBus.getInstance().removeListener(this.favoriteChangeListener)
        this.bottomTabSelectListener && EventBus.getInstance().removeListener(this.bottomTabSelectListener)
    }
    loadData(loadMore, refreshFavorite) {
        const { onRefreshPopular, onLoadMorePopular, onFlushPopularFavorite } = this.props
        const store = this._store()

        const url = this.genFetchUrl(this.storeName)

        if (loadMore) {
            onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callback => {
                this.refs.toast.show('没有更多了')
            })
        } else if (refreshFavorite) {
            onFlushPopularFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao)
        } else {
            onRefreshPopular(this.storeName, url, pageSize, favoriteDao)
        }
    }
    _store() {
        const { popular } = this.props
        let store = popular[this.storeName]
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModels: [],
                hideLoadingMore: true
            }
        }
        return store
    }
    genFetchUrl(key) {
        return URL + key + QUERY_STR
    }
    renderItem(data) {
        const item = data.item
        let { theme } = this.props
        return (
            <PopularItem
                projectModel={item}
                onSelect={(callback) => {
                    NavigationUtil.goPage({
                        projectModel: item,
                        flag: FLAG_STORAGE.flag_popular,
                        callback
                    }, 'DetailPage')
                }}
                theme={theme}
                onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)}
            />
        )
    }
    genIndicator() {
        return this._store().hideLoadingMore ? null :
            (
                <View style={styles.indicatorContainer}>
                    <ActivityIndicator
                        style={styles.indicator}
                    />
                    <Text>正在加载更多</Text>
                </View>
            )
    }
    render() {
        let { theme } = this.props
        let store = this._store()
        if (!store) {
            store = {
                items: [],
                isLoading: false
            }
        }

        return (
            <View style={styles.container}>
                <FlatList
                    data={store.projectModels}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor={item => "" + item.item.id}
                    refreshControl={
                        <RefreshControl
                            title={'loading'}
                            titleColor={theme.themeColor}
                            colors={[theme.themeColor]}
                            refreshing={store.isLoading}
                            onRefresh={() => { this.loadData() }}
                            tintColor={theme.themeColor}
                        />
                    }
                    ListFooterComponent={() => this.genIndicator()}
                    onEndReached={() => {
                        // 保证onMomentumScrollBegin先执行
                        setTimeout(() => {
                            if (this.canLoadMore) {
                                this.canLoadMore = false
                                this.loadData(true)
                            }
                        }, 100)
                    }}
                    onEndReachedThreshold={0.5}
                    onMomentumScrollBegin={() => {
                        this.canLoadMore = true
                    }}
                />
                <Toast ref='toast' position='center' />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    popular: state.popular,
    theme: state.theme.theme
})

const PopularTabPage = connect(
    mapStateToProps,
    {
        onRefreshPopular: actions.onRefreshPopular,
        onLoadMorePopular: actions.onLoadMorePopular,
        onFlushPopularFavorite: actions.onFlushPopularFavorite
    }
)(PopularTab)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabStyle: {
        // minWidth: 50
        padding: 0
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: 'white'
    },
    labelStyle: {
        fontSize: 13,
        margin: 0
        // marginTop: 3,
        // marginBottom: 6
    },
    indicatorContainer: {
        alignItems: 'center'
    },
    indicator: {
        color: 'red',
        margin: 10
    }
});
