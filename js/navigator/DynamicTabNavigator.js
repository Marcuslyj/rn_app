
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation'
import EventBus from 'react-native-event-bus'

import PopularPage from '../page/PopularPage'
import TrendingPage from '../page/TrendingPage'
import FavoritePage from '../page/FavoritePage'
import MyPage from '../page/MyPage'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import NavigationUtil from '../navigator/NavigationUtil';
// import { BottomTabBar } from 'react-navigation-tabs'
import BottomTabBar from 'react-navigation/node_modules/react-navigation-tabs/src/views/BottomTabBar'
import { connect } from 'react-redux'
import EventTypes from '../util/EventTypes'

// 配置路由页面
const TABS = {
    PopularPage: {
        screen: PopularPage,
        navigationOptions: {
            tabBarLabel: "最热",
            tabBarIcon: ({ tintColor, focused }) => (
                <MaterialIcons
                    name={'whatshot'}
                    size={26}
                    style={{ color: tintColor }}
                />
            )
        }
    },
    TrendingPage: {
        screen: TrendingPage,
        navigationOptions: {
            tabBarLabel: "趋势",
            tabBarIcon: ({ tintColor, focused }) => (
                <MaterialIcons
                    name={'trending-up'}
                    size={26}
                    style={{ color: tintColor }}
                />
            )
        }
    },
    FavoritePage: {
        screen: FavoritePage,
        navigationOptions: {
            tabBarLabel: "收藏",
            tabBarIcon: ({ tintColor, focused }) => (
                <MaterialIcons
                    name={'favorite'}
                    size={26}
                    style={{ color: tintColor }}
                />
            )
        }
    },
    MyPage: {
        screen: MyPage,
        navigationOptions: {
            tabBarLabel: "我的",
            tabBarIcon: ({ tintColor, focused }) => (
                <Entypo
                    name={'user'}
                    size={26}
                    style={{ color: tintColor }}
                />
            )
        }
    }
}

class DynamicTabNavigator extends Component {
    constructor(props) {
        super(props)
        console.disableYellowBox = true
    }
    _tabNavigator() {
        // 不要重复创建
        if (this.Tabs) {
            return this.Tabs
        }
        const { PopularPage, TrendingPage, FavoritePage, MyPage } = TABS
        // 根据需要
        const tabs = { PopularPage, TrendingPage, FavoritePage, MyPage }
        return this.Tabs = createBottomTabNavigator(tabs, {
            tabBarComponent: props => {
                return <TabBarComponent {...props} theme={this.props.theme} />
            }
        })
    }
    render() {
        const Tab = this._tabNavigator()
        return (
            <Tab
                onNavigationStateChange={(prevState, newState, action) => {
                    EventBus.getInstance().fireEvent(EventTypes.bottom_tab_select, {
                        from: prevState.index,
                        to: newState.index
                    })
                }}
            />
        )
    }
}

class TabBarComponent extends React.Component {
    constructor(props) {
        super(props)
        this.theme = {
            tintColor: props.activeTintColor,
            updateTime: new Date().getTime()
        }
    }
    render() {
        return <BottomTabBar
            {...this.props}
            activeTintColor={this.props.theme}
        />
    }
}

const mapStateToProps = state => ({
    theme: state.theme.theme
})


export default connect(mapStateToProps)(DynamicTabNavigator)

