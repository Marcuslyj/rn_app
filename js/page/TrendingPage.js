
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button } from 'react-native';
import { connect } from 'react-redux'
import actions from '../action/index'

type Props = {};
class TrendingPage extends Component<Props> {
    render() {
        const { navigation } = this.props
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>TrendingPage</Text>
                <Button
                    title="改变主题颜色"
                    onPress={() => {
                        // navigation.setParams({
                        //     theme: {
                        //         tintColor: 'red',
                        //         updateTime: new Date().getTime()
                        //     }
                        // })
                        this.props.onThemeChange('#096')
                    }}
                ></Button>
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

export default connect(null, mapDispatchToProps)(TrendingPage)