
import React, { Component } from 'react';
import {
    TouchableOpacity, DeviceInfo, ActivityIndicator, FlatList, StyleSheet, Text, View, Button, RefreshControl,
    DeviceEventEmitter
} from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation'
// import NavigationUtil from '../navigator/NavigationUtil'
import { connect } from 'react-redux'
import actions from '../action/index'
import TrendingItem from '../common/TrendingItem'
import Toast, { DURATION } from 'react-native-easy-toast'
import NavigationBar from '../common/NavigationBar'
import NavigationUtil from '../navigator/NavigationUtil';
import TrendingDialog, { TimeSpans } from '../common/TrendingDialog'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FavoriteDao from '../expand/dao/FavoriteDao';
import { FLAG_STORAGE } from '../expand/dao/DataStore';
import FavoriteUtil from '../util/FavoriteUtil';
import EventBus from 'react-native-event-bus';
import EventTypes from '../util/EventTypes';
import { FLAG_LANGUAGE } from '../expand/dao/LanguageDao';
import ArrayUtil from '../util/ArrayUtil';

const URL = 'https://github.com/trending/'
const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE'
const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending)

class TrendingPage extends Component {
    constructor(props) {
        super(props)
        this.TabNav = null

        this.state = {
            timeSpan: TimeSpans[0]
        }

        const { onLoadLanguage } = this.props
        onLoadLanguage(FLAG_LANGUAGE.flag_language)
        this.preKeys = [];
    }
    _genTabs() {
        const tabs = {}
        const { keys } = this.props
        this.preKeys = keys
        keys.forEach((item, index) => {
            if (item.checked) {
                tabs[`tab${index}`] = {
                    screen: props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item.name} />,
                    navigationOptions: {
                        title: item.name
                    }
                }
            }
        })
        return tabs
    }
    onSelectTimeSpan(tab) {
        this.dialog.dismiss()
        this.setState({
            timeSpan: tab
        })
        DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab)
    }
    renderTitleView() {
        return (
            <View>
                <TouchableOpacity
                    underlayColor='transparent'
                    onPress={() => this.dialog.show()}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text
                            style={{
                                fontSize: 18,
                                color: '#fff',
                                fontWeight: '400'
                            }}
                        >
                            趋势{this.state.timeSpan.showText}
                        </Text>
                        <MaterialIcons
                            name='arrow-drop-down'
                            size={22}
                            style={{ color: 'white' }}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    renderTrendingDialog() {
        return (
            <TrendingDialog
                ref={dialog => this.dialog = dialog}
                onSelect={tab => this.onSelectTimeSpan(tab)}
            />
        )
    }
    _tabNav() {
        let { theme } = this.props
        //注意：主题发生变化需要重新渲染top tab

        if (theme !== this.theme || !this.tabNav || !ArrayUtil.isEqual(this.preKeys, this.props.keys)) {
            this.theme = theme;

            this.tabNav = createMaterialTopTabNavigator(
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
            )
        }
        return this.tabNav
    }
    render() {
        const { keys, theme } = this.props
        let statusBar = {
            backgroundColor: theme.themeColor,
            barStyle: 'light-content'
        }
        let navigationBar = (
            <NavigationBar
                titleView={this.renderTitleView()}
                statusBar={statusBar}
                style={{ backgroundColor: theme.themeColor }}
            />
        )
        const TabNavigator = keys.length ? this._tabNav() : null

        return (
            <View style={styles.container}>
                {navigationBar}
                {TabNavigator && <TabNavigator />}
                {this.renderTrendingDialog()}
            </View>

        )
    }
}

const mapTrendingStateToProps = state => ({
    keys: state.language.languages,
    theme: state.theme.theme
})

export default connect(
    mapTrendingStateToProps,
    {
        onLoadLanguage: actions.onLoadLanguage
    }
)(TrendingPage)

const pageSize = 10
class TrendingTab extends Component {
    constructor(props) {
        super(props)
        const { tabLabel, timeSpan } = this.props
        this.storeName = tabLabel
        this.timeSpan = timeSpan
        this.isFavoriteChanged = false
    }
    componentDidMount() {
        this.loadData()
        this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
            this.timeSpan = timeSpan
            this.loadData()
        })

        EventBus.getInstance().addListener(EventTypes.favorite_change_trending, this.favoriteChangeListener = () => {
            this.isFavoriteChanged = true
        })

        EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = data => {
            if (data.to === 1 && this.isFavoriteChanged) {
                this.loadData(null, true)
            }
        })
    }
    componentWillUnmount() {
        if (this.timeSpanChangeListener) {
            this.timeSpanChangeListener.remove()
        }
        EventBus.getInstance().removeListener(this.favoriteChangeListener)
        EventBus.getInstance().removeListener(this.bottomTabSelectListener)
    }
    loadData(loadMore, refreshFavorite) {
        const { onRefreshTrending, onLoadMoreTrending, onFlushTrendingFavorite } = this.props
        const store = this._store()
        const url = this.genFetchUrl(this.storeName)

        if (loadMore) {
            onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, favoriteDao, callback => {
                this.refs.toast.show('没有更多了')
            })
        } else if (refreshFavorite) {
            onFlushTrendingFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao)
        } else {
            onRefreshTrending(this.storeName, url, pageSize, favoriteDao)
        }
    }
    _store() {
        const { trending } = this.props
        let store = trending[this.storeName]
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
        return URL + key + '?since=' + this.timeSpan.searchText
    }
    renderItem(data) {
        let { theme } = this.props
        const item = data.item
        return (
            <TrendingItem
                projectModel={item}
                onSelect={(callback) => {
                    NavigationUtil.goPage({
                        projectModel: item,
                        flag: FLAG_STORAGE.flag_trending,
                        callback
                    }, 'DetailPage')
                }}
                theme={theme}
                onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_trending)}
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
                    keyExtractor={item => "" + (item.item.fullName)}
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
    trending: state.trending,
    theme: state.theme.theme
})

const TrendingTabPage = connect(
    mapStateToProps,
    {
        onRefreshTrending: actions.onRefreshTrending,
        onLoadMoreTrending: actions.onLoadMoreTrending,
        onFlushTrendingFavorite: actions.onFlushTrendingFavorite
    }
)(TrendingTab)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabStyle: {
        // minWidth: 50,
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
