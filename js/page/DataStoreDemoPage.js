
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Button } from 'react-native';
import DataStore from '../expand/dao/DataStore';
export default class DataStoreDemoPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            text: ''
        }
        this.keyword = ''
        this.dataStore = new DataStore()
    }
    loadData() {
        let url = `https://api.github.com/search/repositories?q=${this.keyword}`
        this.dataStore.fetchData(url)
            .then(data => {
                let showData = `初次加载数据时间：${new Date(data.timestamp)}\n${JSON.stringify(data.data)}`
                this.setState({
                    text: showData
                })
            }).catch(error => {
                error && console.log(error)
            })
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        onChangeText={text => {
                            this.keyword = text
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
        backgroundColor: '#F5FCFF',
    },
    inputWrapper: {
        flexDirection: 'row',
        marginRight: 10
    },
    input: {
        height: 36,
        borderColor: 'black',
        borderWidth: 1,
        marginRight: 10,
        marginLeft: 10,
        flex: 1
    },
});
