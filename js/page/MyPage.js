
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button } from 'react-native';
import { connect } from 'react-redux'
import actions from '../action/index'
import NavigationUtil from '../navigator/NavigationUtil'

type Props = {};
class MyPage extends Component<Props> {
    render() {
        const { navigation } = this.props

        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>MyPage</Text>
                <Button
                    title="改变主题颜色"
                    onPress={() => {
                        this.props.onThemeChange('#159')
                    }}
                ></Button>

                <Text onPress={() => {
                    NavigationUtil.goPage(null, "DetailPage")
                }}>跳转详情页</Text>
                <Button title="跳转Fetch页面" onPress={() => {
                    NavigationUtil.goPage(null, "FetchDemoPage")
                }}></Button>
                <Button title="离线缓存框架" onPress={() => {
                    NavigationUtil.goPage(null, "DataStoreDemoPage")
                }}></Button>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
});

// const mapStateToProps = state => {

// }

const mapDispatchToProps = dispatch => ({
    onThemeChange: theme => dispatch(actions.onThemeChange(theme))
})

export default connect(null, mapDispatchToProps)(MyPage)