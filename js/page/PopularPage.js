
import React, { Component } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View, Button, RefreshControl } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation'
// import NavigationUtil from '../navigator/NavigationUtil'
import { connect } from 'react-redux'
import actions from '../action/index'
import PopularItem from '../common/PopularItem'
import Toast, { DURATION } from 'react-native-easy-toast'

const URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
const THEME_COLOR = 'green'

type Props = {};
export default class PopularPage extends Component<Props> {
    constructor(props) {
        super(props)
        this.tabNames = ['Java', 'Android', 'IOS', 'React', 'React Native', 'PHP']
    }
    _genTabs() {
        const tabs = {}
        this.tabNames.forEach((item, index) => {
            // console.log(index);

            tabs[`tab${index}`] = {
                // screen: props => <PopularTab {...props} tabLabel={item} />,
                screen: props => <PopularTabPage {...props} tabLabel={item} />,
                navigationOptions: {
                    title: item
                }
            }
        })
        return tabs
    }
    render() {
        const TabNavigator = createMaterialTopTabNavigator(
            this._genTabs(),
            {
                tabBarOptions: {
                    tabStyle: styles.tabStyle,
                    upperCaseLabel: false,
                    scrollEnabled: true,
                    style: {
                        backgroundColor: '#678'
                    },
                    indicatorStyle: styles.indicatorStyle,
                    labelStyle: styles.labelStyle
                }
            }
        )
        return (
            <View style={{ flex: 1, marginTop: 0 }}>
                <TabNavigator />
            </View>

        )
    }
}
const pageSize = 10
class PopularTab extends Component<Props> {
    constructor(props) {
        super(props)
        const { tabLabel } = this.props
        this.storeName = tabLabel
    }
    componentDidMount() {
        this.loadData()
    }
    loadData(loadMore) {
        const { onRefreshPopular, onLoadMorePopular } = this.props
        const store = this._store()

        const url = this.genFetchUrl(this.storeName)

        if (loadMore) {
            onLoadMorePopular(this.storeName, ++store.pageIndex, pageSize, store.items, callback => {
                this.refs.toast.show('没有更多了')
            })
        } else {
            onRefreshPopular(this.storeName, url, pageSize)
        }
    }
    _store() {
        const { popular } = this.props
        let store = popular[this.storeName]
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
        return URL + key + QUERY_STR
    }
    renderItem(data) {
        const item = data.item
        return (
            <PopularItem
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
        // const { popular } = this.props
        // let store = popular && popular[this.storeName]
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
                    keyExtractor={item => "" + item.id}
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
    popular: state.popular
})
// const mapDispatchToProps = dispatch => ({
//     onRefreshPopular: (storeName, url) => dispatch(actions.onRefreshPopular(storeName, url))
// })

const PopularTabPage = connect(
    mapStateToProps,
    {
        onRefreshPopular: actions.onRefreshPopular,
        onLoadMorePopular: actions.onLoadMorePopular
    }
)(PopularTab)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tabStyle: {
        minWidth: 50
    },
    indicatorStyle: {
        height: 2,
        backgroundColor: 'white'
    },
    labelStyle: {
        fontSize: 13,
        marginTop: 3,
        marginBottom: 6
    },
    indicatorContainer: {
        alignItems: 'center'
    },
    indicator: {
        color: 'red',
        margin: 10
    }
});
