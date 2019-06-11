
import React, { Component } from 'react';
import NavigationUtil from '../navigator/NavigationUtil';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation';
import BackPressComponent from '../common/BackPressComponent'
import actions from '../action/index';
import { View } from 'react-native'
import CustomTheme from '../page/CustomTheme';

class HomePage extends Component {
    constructor(props) {
        super(props)
        this.backPress = new BackPressComponent({
            backPress: this.onBackPress
        })
    }
    // 监听返回按钮
    componentDidMount() {
        this.backPress.componentDidMount()
    }
    componentWillUnmount() {
        this.backPress.componentWillUnmount()
    }
    renderCustomThemeView() {
        const { customThemeViewVisible, onShowCustomThemeView } = this.props;
        return (<CustomTheme
            visible={customThemeViewVisible}
            {...this.props}
            onClose={() => onShowCustomThemeView(false)}
        />)
    }
    render() {
        // 外层navigation存起来
        NavigationUtil.navigation = this.props.navigation

        return (
            <View style={{ flex: 1 }}>
                <DynamicTabNavigator />
                {this.renderCustomThemeView()}
            </View>
        )
    }
    onBackPress = () => {
        const { dispatch, nav } = this.props
        if (nav.routes[1].index === 0) {
            return false
        }
        dispatch(NavigationActions.back())
        // 禁止按钮
        return true
    }
}

const mapStateToProps = state => ({
    nav: state.nav,
    customThemeViewVisible: state.theme.customThemeViewVisible,
    theme: state.theme.theme,
})

export default connect(mapStateToProps, {
    onShowCustomThemeView: actions.onShowCustomThemeView
})(HomePage)

