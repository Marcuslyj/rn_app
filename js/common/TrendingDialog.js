import React, { Component } from 'react'
import { Modal, TouchableOpacity, StyleSheet, View, Text } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import TimeSpan from '../mo/TimeSpan'

export const TimeSpans = [
    new TimeSpan('今天', 'daily'),
    new TimeSpan('本周', 'weekly'),
    new TimeSpan('本月', 'monthly')
]

export default class TrendingDialog extends Component {
    state = {
        visible: false
    }
    show() {
        this.setState({
            visible: true
        })
    }
    dismiss() {
        this.setState({
            visible: false
        })
    }
    render() {
        const { onClose, onSelect } = this.props
        return (
            <Modal
                transparent={true}
                visible={this.state.visible}
                onRequestClose={onClose}
            >
                <TouchableOpacity
                    style={styles.container}
                    onPress={() => { }}
                >
                    <MaterialIcons
                        name='arrow-drop-up'
                        size={36}
                        style={styles.arrow}
                    />
                    <View style={styles.content}>
                        {
                            TimeSpans.map((result, i, arr) => {
                                retutn(
                                    <TouchableOpacity
                                        onPress={() => onSelect(arr[i])}
                                        underlayColor='transparent'
                                    >
                                        <View style={styles.text_container}>
                                            <Text>{arr[i].showText}</Text>
                                            {
                                                i !== arr.length - 1 ?
                                                    <View style={styles.line} />
                                                    : null
                                            }
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'rgba(0,0,0,0.6)',
        flex: 1,
        alignItems: 'center'
    },
    arrow: {
        marginTop: 40,
        color: 'white',
        padding: 0,
        margin: -15
    },
    content: {
        backgroundColor: 'white',
        borderRadius: 3,
        paddingTop: 3,
        paddingBottom: 3,
        marginRight: 3
    },
    text_container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        fontSize: 16,
        color: 'black',
        fontWeight: 400,
        padding: 8,
        paddingLeft: 26,
        paddingRight: 26
    },
    line: {
        height: 0.3,
        backgroundColor: 'darkgray'
    }
})