
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity, WebView, DeviceInfo } from 'react-native';
import NavigationBar from '../common/NavigationBar'
import ViewUtil from '../util/ViewUtil';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import NavigationUtil from '../navigator/NavigationUtil'

const TRENDING_URL = 'https://github.com/'
const THEME_COLOR = '#678'

type Props = {};
export default class DetailPage extends Component<Props> {
    constructor(props) {
        super(props)
        this.params = props.navigation.state.params
        const { projectModel } = this.params
        this.url = projectModel.html_url || TRENDING_URL + projectModel.fullName
        const title = projectModel.full_name || projectModel.fullName

        this.state = {
            title,
            url: this.url,
            canGoBack: false
        }
    }
    onBack() {
        if (this.state.canGoBack) {
            this.webView.goBack()
        } else {
            NavigationUtil.goBack(this.props.navigation)
        }
    }
    renderRightButton() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    onPress={() => { }}
                >
                    <FontAwesome
                        name='star-o'
                        size={20}
                        style={{ color: 'white', marginRight: 10 }}
                    />
                </TouchableOpacity>
                {
                    ViewUtil.getShareButton(() => {

                    })
                }
            </View>
        )
    }
    onNavigationStateChange(navState) {
        this.setState({
            canGoBack: navState.canGoBack,
            url: navState.url
        })

    }
    render() {
        const titleLayoutStyle = this.state.title.length > 20 ? { marginRight: 30 } : null
        let navigationBar = <NavigationBar
            leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
            title={this.state.title}
            titleLayoutStyle={titleLayoutStyle}
            style={{ backgroundColor: THEME_COLOR }}
            rightButton={this.renderRightButton()}
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
