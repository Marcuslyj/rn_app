
import React, { Component } from 'react';
import { DeviceInfo, ActivityIndicator, FlatList, StyleSheet, Text, View, Button, RefreshControl } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation'
import { connect } from 'react-redux'
import actions from '../action/index'
import PopularItem from '../common/PopularItem'
import TrendingItem from '../common/TrendingItem'
import Toast, { DURATION } from 'react-native-easy-toast'
import NavigationBar from '../common/NavigationBar'
import FavoriteDao from '../expand/dao/FavoriteDao';
import { FLAG_STORAGE } from '../expand/dao/DataStore';
import NavigationUtil from '../navigator/NavigationUtil';
import FavoriteUtil from '../util/FavoriteUtil'
import EventBus from 'react-native-event-bus';
import EventTypes from '../util/EventTypes';

class FavoritePage extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let { theme } = this.props
        let statusBar = {
            backgroundColor: theme.themeColor,
            barStyle: 'light-content'
        }
        let navigationBar = (
            <NavigationBar
                title='收藏'
                statusBar={statusBar}
                style={{ backgroundColor: theme.themeColor }}
            />
        )

        const TabNavigator = createMaterialTopTabNavigator(
            {
                'Popular': {
                    screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular} />,
                    navigationOptions: {
                        title: '最热'
                    }
                },
                'trending': {
                    screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending} />,
                    navigationOptions: {
                        title: '趋势'
                    }
                }
            },
            {
                tabBarOptions: {
                    tabStyle: styles.tabStyle,
                    upperCaseLabel: false,
                    // scrollEnabled: true,
                    style: {
                        backgroundColor: theme.themeColor,
                        height: 30 //fix 开启scrollEnabled时，高度异常
                    },
                    indicatorStyle: styles.indicatorStyle,
                    labelStyle: styles.labelStyle
                }
            }
        )
        return (
            <View style={styles.container}>
                {navigationBar}
                <TabNavigator />
            </View>

        )
    }
}

const mapFavoriteStateToProps = state => ({
    theme: state.theme.theme
})

export default connect(mapFavoriteStateToProps)(FavoritePage)

class FavoriteTab extends Component {
    constructor(props) {
        super(props)
        const { flag } = this.props
        this.storeName = flag
        this.favoriteDao = new FavoriteDao(flag)
    }
    componentDidMount() {
        this.loadData(true)
        EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.listener = data => {
            if (data.to === 2) {
                this.loadData(false)
            }
        })
    }
    componentWillUnmount() {
        EventBus.getInstance().removeListener(this.listener);
    }
    loadData(isShowLoading) {
        const { onLoadFavoriteData } = this.props
        onLoadFavoriteData(this.storeName, isShowLoading)
    }
    _store() {
        const { favorite } = this.props
        let store = favorite[this.storeName]
        if (!store) {
            store = {
                items: [],
                isLoading: false,
                projectModels: [],
            }
        }
        return store
    }
    onFavorite(item, isFavorite) {
        FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.storeName)
        if (this.storeName === FLAG_STORAGE.flag_popular) {
            EventBus.getInstance().fireEvent(EventTypes.favorite_change_popular)
        } else {
            EventBus.getInstance().fireEvent(EventTypes.favorite_change_trending)
        }
    }
    renderItem(data) {
        let { theme } = this.props

        const item = data.item
        const Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem

        return (
            <Item
                projectModel={item}
                onSelect={(callback) => {
                    NavigationUtil.goPage({
                        projectModel: item,
                        flag: this.storeName,
                        callback
                    }, 'DetailPage')
                }}
                theme={theme}
                onFavorite={(item, isFavorite) => this.onFavorite(item, isFavorite)}
            />
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
                    keyExtractor={item => "" + (item.item.fullName || item.item.id)}
                    refreshControl={
                        <RefreshControl
                            title={'loading'}
                            titleColor={theme.themeColor}
                            colors={[theme.themeColor]}
                            refreshing={store.isLoading}
                            onRefresh={() => { this.loadData(true) }}
                            tintColor={theme.themeColor}
                        />
                    }
                />
                <Toast ref='toast' position='center' />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    favorite: state.favorite,
    theme: state.theme.theme
})

const FavoriteTabPage = connect(
    mapStateToProps,
    {
        onLoadFavoriteData: actions.onLoadFavoriteData
    }
)(FavoriteTab)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabStyle: {
        padding: 0
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: 'white'
    },
    labelStyle: {
        fontSize: 13,
        margin: 0
    },
    indicatorContainer: {
        alignItems: 'center'
    },
    indicator: {
        color: 'red',
        margin: 10
    }
});
