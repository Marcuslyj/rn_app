
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux'
import actions from '../action/index'
import NavigationUtil from '../navigator/NavigationUtil'
import NavigationBar from '../common/NavigationBar'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons'

const THEME_COLOR = 'orange'

type Props = {};
class MyPage extends Component<Props> {
    getRightButton() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    onPress={() => {

                    }}
                >
                    <View style={{ padding: 5, marginRight: 8 }}>
                        <Feather
                            name='search'
                            size={24}
                            style={{ color: 'white' }}
                        />
                    </View>

                </TouchableOpacity>
            </View>
        )
    }
    getLeftButton(callback) {
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    style={{ padding: 8, paddingLeft: 12 }}
                    onPress={()=>{}}
                >
                    <Ionicons
                        name='ios-arrow-back'
                        size={26}
                        style={{ color: 'white' }}
                    />

                </TouchableOpacity>
            </View>
        )
    }
    render() {
        let statusBar = {
            backgroundColor: THEME_COLOR,
            barStyle: 'light-content'
        }
        console.log('====================================');
        console.log(this.getRightButton());
        console.log('====================================');
        let navigationBar = (
            <NavigationBar
                title='我的'
                statusBar={statusBar}
                rightButton={this.getRightButton()}
                leftButton={this.getLeftButton()}
                style={{ backgroundColor: THEME_COLOR }}
            />
        )

        return (
            <View style={styles.container}>
                {navigationBar}
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