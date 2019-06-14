
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import NavigationUtil from '../navigator/NavigationUtil'
import SplashScreen from 'react-native-splash-screen'

export default class WelcomePage extends Component {
    componentDidMount() {
        this.timer = setTimeout(() => {
            SplashScreen.hide();

            const { navigation } = this.props

            NavigationUtil.resetToHomePage({
                navigation
            })
        }, 500)
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer)
    }
    render() {
        return null
        // return (
        //     <View style={styles.container}>
        //         <Text style={styles.welcome}>WelcomePage</Text>
        //     </View>
        // );
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
