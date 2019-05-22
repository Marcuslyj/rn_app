
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Button } from 'react-native';


type Props = {};
export default class FetchDemoPage extends Component<Props> {
    constructor(props) {
        super(props)
        this.state = {
            text: ''
        }
    }
    loadData() {
        let url = `https://api.github.com/search/repositories?q=${this.searchKey}`
        fetch(url)
            .then(res => res.text())
            .then(res => {
                this.setState({
                    text: res
                })
            })
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        onChangeText={text => {
                            this.searchKey = text
                        }}
                    />
                    <Button
                        title="获取"
                        style={styles.searchBtn}
                        onPress={() => {
                            this.loadData()
                        }}
                    />
                </View>

                <Text>查询结果:</Text>
                <Text>{this.state.text}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    inputWrapper: {
        flexDirection: 'row',
        marginRight:10
    },
    input: {
        height: 36,
        borderColor: 'black',
        borderWidth: 1,
        marginRight: 10,
        marginLeft: 10,
        flex: 1
    },
    searchBtn: {
        // marginLeft: 50
    }
});
