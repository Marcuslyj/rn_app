import React, { Component } from 'react'
import { ViewPropTypes, Text, StatusBar, StyleSheet, View, Platform } from 'react-native'
import { PropTypes } from 'prop-types'

const NAV_BAR_HEIGHT_IOS = 44
const NAV_BAR_HEIGHT_ANDROID = 50
const STATUS_BAR_HEIGHT = 20

const StatusBarShape = {
    barStyle: PropTypes.oneOf(['light-content', 'default']),
    hidden: PropTypes.bool,
    backgroundColor: PropTypes.string
}

export default class NavigationBar extends Component {
    // 属性类型检查
    static PropTypes = {
        style: ViewPropTypes.style,
        title: PropTypes.string,
        titleView: PropTypes.element,
        titleLayoutStyle: ViewPropTypes.style,
        hide: PropTypes.bool,
        statusBar: PropTypes.shape(StatusBarShape),
        rightButton: PropTypes.element,
        leftButton: PropTypes.element
    }
    static defaultProps = {
        statusBar: {
            barStyle: 'light-content',
            hidden: false
        }
    }
    getButtonElement(data) {
        return (
            <View style={styles.navBarButton}>
                {data ? data : null}
            </View>
        )
    }
    render() {
        let statusBar = !this.props.statusBar.hidden ?
            (
                <View style={styles.statusBar}>
                    <StatusBar {...this.props.statusBar} />
                </View>
            ) : null

        let titleView = this.props.titleView ? this.props.titleView :
            (
                <Text ellipsizeMode="head" numberOfLines={1} style={styles.title}>{this.props.title}</Text>
            )

        let content = this.props.hide ? null :
            (
                <View style={[styles.navBar, { backgroundColor: this.props.style.backgroundColor }]}>
                    {this.getButtonElement(this.props.leftButton)}
                    <View style={[styles.navBarTitleContainer, this.props.titleLayoutStyle]}>
                        {titleView}
                    </View>
                    {this.getButtonElement(this.props.rightButton)}
                </View>
            )
        return (
            <View style={styles.container}>
                {statusBar}
                {content}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#2196f3'
    },
    statusBar: {
        height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0
    },
    title: {
        fontSize: 20,
        color: 'white'
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID
    },
    navBarButton: {
        alignItems: 'center'
    },
    navBarTitleContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 40,
        right: 40,
        top: 0,
        bottom: 0,
    }
})