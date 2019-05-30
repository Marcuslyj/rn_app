
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
import TrendingDialog, { TimeSpans } from '../common/TrendingDialog'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const URL = 'https://github.com/trending/'
const THEME_COLOR = '#678'
const EVENT_TYPE_TIME_SPAN_CHANGE = 'EVENT_TYPE_TIME_SPAN_CHANGE'

type Props = {};
export default class TrendingPage extends Component<Props> {
    constructor(props) {
        super(props)
        this.tabNames = ['All', 'C', 'C#', 'PHP', 'JavaScript']
        this.state = {
            timeSpan: TimeSpans[0]
        }
    }
    _genTabs() {
        const tabs = {}
        this.tabNames.forEach((item, index) => {

            tabs[`tab${index}`] = {
                screen: props => <TrendingTabPage {...props} timeSpan={this.state.timeSpan} tabLabel={item} />,
                navigationOptions: {
                    title: item
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
        if (!this.tabNav) {
            this.tabNav = createMaterialTopTabNavigator(
                this._genTabs(),
                {
                    tabBarOptions: {
                        tabStyle: styles.tabStyle,
                        upperCaseLabel: false,
                        scrollEnabled: true,
                        style: {
                            backgroundColor: '#678',
                            height: 30 //fix 开启scrollEnabled时，高度异常
                        },
                        indicatorStyle: styles.indicatorStyle,
                        labelStyle: styles.labelStyle
                    }
                }
            )
        }
        return this.tabNav
    }
    render() {
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle: 'light-content'
        }
        let navigationBar = (
            <NavigationBar
                titleView={this.renderTitleView()}
                statusBar={statusBar}
                style={{ backgroundColor: THEME_COLOR }}
            />
        )
        const TabNavigator = this._tabNav()
        return (
            <View style={{ flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0 }}>
                {navigationBar}
                <TabNavigator />
                {this.renderTrendingDialog()}
            </View>

        )
    }
}
const pageSize = 10
class TrendingTab extends Component<Props> {
    constructor(props) {
        super(props)
        const { tabLabel, timeSpan } = this.props
        this.storeName = tabLabel
        this.timeSpan = timeSpan
    }
    componentDidMount() {
        this.loadData()
        this.timeSpanChangeListener = DeviceEventEmitter.addListener(EVENT_TYPE_TIME_SPAN_CHANGE, (timeSpan) => {
            this.timeSpan = timeSpan
            this.loadData()
        })
    }
    componentWillUnmount() {
        if (this.timeSpanChangeListener) {
            this.timeSpanChangeListener.remove()
        }
    }
    loadData(loadMore) {
        const { onRefreshTrending, onLoadMoreTrending } = this.props
        const store = this._store()
        const url = this.genFetchUrl(this.storeName)

        if (loadMore) {
            onLoadMoreTrending(this.storeName, ++store.pageIndex, pageSize, store.items, callback => {
                this.refs.toast.show('没有更多了')
            })
        } else {
            onRefreshTrending(this.storeName, url, pageSize)
        }
    }
    _store() {
        const { trending } = this.props
        let store = trending[this.storeName]
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModes: [],
                hideLoadingMore: true
            }
        }
        return store
    }
    genFetchUrl(key) {
        return URL + key + '?since=' + this.timeSpan.searchText
    }
    renderItem(data) {
        const item = data.item
        return (
            <TrendingItem
                item={item}
                onSelect={() => { }}
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
                    data={store.projectModes}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor={item => "" + (item.id || item.fullName)}
                    refreshControl={
                        <RefreshControl
                            title={'loading'}
                            titleColor={THEME_COLOR}
                            colors={[THEME_COLOR]}
                            refreshing={store.isLoading}
                            onRefresh={() => { this.loadData() }}
                            tintColor={THEME_COLOR}
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
    trending: state.trending
})

const TrendingTabPage = connect(
    mapStateToProps,
    {
        onRefreshTrending: actions.onRefreshTrending,
        onLoadMoreTrending: actions.onLoadMoreTrending
    }
)(TrendingTab)

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
