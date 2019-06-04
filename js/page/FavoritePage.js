
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

const THEME_COLOR = '#678'

export default class FavoritePage extends Component {
    constructor(props) {
        super(props)
        // this.tabNames = ['最热', '趋势']
    }

    render() {
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle: 'light-content'
        }
        let navigationBar = (
            <NavigationBar
                title='收藏'
                statusBar={statusBar}
                style={{ backgroundColor: THEME_COLOR }}
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
                        backgroundColor: '#678',
                        height: 30 //fix 开启scrollEnabled时，高度异常
                    },
                    indicatorStyle: styles.indicatorStyle,
                    labelStyle: styles.labelStyle
                }
            }
        )
        return (
            <View style={{ flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0 }}>
                {navigationBar}
                <TabNavigator />
            </View>

        )
    }
}
class FavoriteTab extends Component {
    constructor(props) {
        super(props)
        const { flag } = this.props
        this.storeName = flag
        this.favoriteDao = new FavoriteDao(flag)
    }
    componentDidMount() {
        this.loadData()
    }
    loadData() {
        const { onLoadFavoriteData } = this.props
        onLoadFavoriteData(this.storeName)
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
    renderItem(data) {
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
                onFavorite={(item, isFavorite) => FavoriteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.storeName)}
            />
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
                    data={store.projectModels}
                    renderItem={data => this.renderItem(data)}
                    keyExtractor={item => "" + (item.item.fullName || item.item.id)}
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
                />
                <Toast ref='toast' position='center' />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    favorite: state.favorite
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
