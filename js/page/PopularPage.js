
import React, { Component } from 'react';
import { FlatList, StyleSheet, Text, View, Button, RefreshControl } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation'
// import NavigationUtil from '../navigator/NavigationUtil'
import { connect } from 'react-redux'
import actions from '../action/index'

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
            console.log(index);

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

class PopularTab extends Component<Props> {
    constructor(props) {
        super(props)
        const { tabLabel } = this.props
        this.storeName = tabLabel
    }
    componentDidMount() {
        this.loadData()
    }
    loadData() {
        const { onLoadPopularData } = this.props

        const url = this.genFetchUrl(this.storeName)
        onLoadPopularData(this.storeName, url)
    }
    genFetchUrl(key) {
        return URL + key + QUERY_STR
    }
    renderItem(data) {
        const item = data.item
        return (
            <View style={{ marginTop: 10 }}>
                <Text style={{ backgroundColor: '#faa' }}>{JSON.stringify(item)}</Text>
            </View>
        )
    }
    render() {
        const { popular } = this.props
        let store = popular && popular[this.storeName]
        if (!store) {
            store = {
                items: [],
                isLoading: false
            }
        }

        return (
            <View style={styles.container}>
                <FlatList
                    data={store.items}
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
                />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    popular: state.popular
})
// const mapDispatchToProps = dispatch => ({
//     onLoadPopularData: (storeName, url) => dispatch(actions.onLoadPopularData(storeName, url))
// })

const PopularTabPage = connect(
    mapStateToProps,
    {
        onLoadPopularData: actions.onLoadPopularData
    }
)(PopularTab)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        // backgroundColor: '#F5FCFF',
    },
    // welcome: {
    //     fontSize: 20,
    //     textAlign: 'center',
    //     margin: 10,
    // },
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
    }
});
