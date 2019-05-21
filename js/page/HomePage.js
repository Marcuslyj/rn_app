
import React, { Component } from 'react';
import NavigationUtil from '../navigator/NavigationUtil';
import DynamicTabNavigator from '../navigator/DynamicTabNavigator'
import { connect } from 'react-redux'
import { BackHandler } from 'react-native'
import { NavigationActions } from 'react-navigation';

type Props = {};

class HomePage extends Component<Props> {
    // 监听返回按钮
    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.onBackPress)
    }
    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.onBackPress)
    }

    render() {
        // 外层navigation存起来
        NavigationUtil.navigation = this.props.navigation

        return <DynamicTabNavigator />
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
    nav: state.nav
})

// const mapDispatchToProps = dispatch => ({
// onThemeChange: theme => dispatch(actions.onThemeChange(theme))
// })

export default connect(mapStateToProps)(HomePage)

