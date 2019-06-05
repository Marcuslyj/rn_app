
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, WebView, DeviceInfo } from 'react-native';
import NavigationBar from '../common/NavigationBar'
import ViewUtil from '../util/ViewUtil';
import NavigationUtil from '../navigator/NavigationUtil'
import BackPressComponent from '../common/BackPressComponent'

const THEME_COLOR = '#678'
export default class WebViewPage extends Component {
    constructor(props) {
        super(props)
        this.params = props.navigation.state.params

        let { title, url } = this.params

        this.state = {
            title,
            url,
            canGoBack: false
        }
        this.webView = null
        this.backPress = new BackPressComponent({
            backPress: this.onBackPress.bind(this)
        })
    }
    // 监听返回按钮
    componentDidMount() {
        this.backPress.componentDidMount()
    }
    componentWillUnmount() {
        this.backPress.componentWillUnmount()
    }
    onBackPress() {
        this.onBack()
        return true
    }
    onBack() {
        if (this.state.canGoBack) {
            this.webView.goBack()
        } else {
            NavigationUtil.goBack(this.props.navigation)
        }
    }
    onNavigationStateChange(navState) {
        this.setState({
            canGoBack: navState.canGoBack,
            url: navState.url
        })
    }
    render() {
        let navigationBar = <NavigationBar
            title={this.state.title}
            style={{ backgroundColor: THEME_COLOR }}
            leftButton = {ViewUtil.getLeftBackButton(()=>{
                this.onBackPress()
            })}
        />
        return (
            <View style={styles.container}>
                {navigationBar}
                <WebView
                    ref={webView => this.webView = webView}
                    startInLoadingState={true}
                    onNavigationStateChange={e => this.onNavigationStateChange(e)}
                    source={{ uri: this.state.url }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0
    }
});
