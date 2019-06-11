import React, { Component } from 'react'
import { View, Text, StyleSheet, Alert, TouchableHighlight } from 'react-native'
import LanguageDao from '../expand/dao/LanguageDao';
import { connect } from 'react-redux'
import actions from '../action/index'
import NavigationBar from '../common/NavigationBar'
import ViewUtil from '../util/ViewUtil'
import CheckBox from 'react-native-check-box'
import { FLAG_LANGUAGE } from '../expand/dao/LanguageDao'
import Ionicons from 'react-native-vector-icons/Ionicons';
import NavigationUtil from '../navigator/NavigationUtil';
import ArrayUtil from '../util/ArrayUtil';
import SortableListView from 'react-native-sortable-listview'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const THEME_COLOR = '#678'

class SortKeyPage extends Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.changeValues = [];
        this.isRemoveKey = !!this.params.isRemoveKey;
        this.languageDao = new LanguageDao(this.params.flag);
        this.state = {
            checkedArray: SortKeyPage._keys(this.props)
        }
    }
    componentDidMount() {
        // 如果props中标签为空则从本地存储中获取标签
        if (!this.state.checkedArray || this.state.checkedArray.length === 0) {
            let { onLoadLanguage } = this.props;
            onLoadLanguage(this.params.flag);
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        const checkedArray = SortKeyPage._keys(nextProps, prevState)
        if (prevState.checkedArray !== checkedArray) {
            return {
                checkedArray: checkedArray,
            }
        }
        return null;
    }
    static _flag(props) {
        const { flag } = props.navigation.state.params;
        return flag === FLAG_LANGUAGE.flag_key ? "keys" : "languages";
    }
    /**
     * 获取标签
     * @param {*} props 
     * @param {*} state 
     */
    static _keys(props, state) {
        //如果state中有checkedArray则使用state中的checkedArray
        if (state && state.checkedArray && state.checkedArray.length) {
            return state.checkedArray;
        }
        //否则从原始数据中获取checkedArray
        const flag = SortKeyPage._flag(props);
        let dataArray = props.language[flag] || [];
        let keys = [];
        for (let i = 0, j = dataArray.length; i < j; i++) {
            let data = dataArray[i];
            if (data.checked) keys.push(data);
        }
        return keys;
    }

    onBack() {
        if (!ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
            Alert.alert('提示', '要保存修改吗？',
                [
                    {
                        text: '否', onPress: () => {
                            NavigationUtil.goBack(this.props.navigation)
                        }
                    }, {
                        text: '是', onPress: () => {
                            this.onSave(true);
                        }
                    }
                ])
        } else {
            NavigationUtil.goBack(this.props.navigation)
        }
    }
    /**
     * 获取排序后的标签结果
     * @returns {Array}
     */
    getSortResult() {
        const flag = SortKeyPage._flag(this.props);
        //从原始数据中复制一份数据出来，以便对这份数据进行进行排序
        let sortResultArray = ArrayUtil.clone(this.props.language[flag]);
        //获取排序之前的排列顺序
        const originalCheckedArray = SortKeyPage._keys(this.props);
        //遍历排序之前的数据，用排序后的数据checkedArray进行替换
        for (let i = 0, j = originalCheckedArray.length; i < j; i++) {
            let item = originalCheckedArray[i];
            //找到要替换的元素所在位置
            let index = this.props.language[flag].indexOf(item);
            //进行替换
            sortResultArray.splice(index, 1, this.state.checkedArray[i]);
        }
        return sortResultArray;
    }
    onSave(hasChecked) {
        if (!hasChecked) {
            //如果没有排序则直接返回
            if (ArrayUtil.isEqual(SortKeyPage._keys(this.props), this.state.checkedArray)) {
                NavigationUtil.goBack(this.props.navigation);
                return;
            }
        }
        //保存排序后的数据
        //获取排序后的数据
        //更新本地数据
        this.languageDao.save(this.getSortResult());

        //重新加载排序后的标签，以便其他页面能够及时更新
        const { onLoadLanguage } = this.props;
        //更新store
        onLoadLanguage(this.params.flag);
        NavigationUtil.goBack(this.props.navigation);
    }
    onClick(data, index) {
        data.checked = !data.checked;
        ArrayUtil.updateArray(this.changeValues, data);
        this.state.keys[index] = data;//更新state以便显示选中状态
        this.setState({
            keys: this.state.keys
        })
    }
    _checkedImage(checked) {
        return <Ionicons
            name={checked ? 'ios-checkbox' : 'md-square-outline'}
            size={20}
            style={{
                color: THEME_COLOR,
            }} />
    }
    renderCheckBox(data, index) {
        return <CheckBox
            style={{ flex: 1, padding: 10 }}
            onClick={() => this.onClick(data, index)}
            isChecked={data.checked}
            leftText={data.name}
            checkedImage={this._checkedImage(true)}
            unCheckedImage={this._checkedImage(false)}
        />
    }
    renderView() {
        let dataArray = this.state.keys;
        if (!dataArray || dataArray.length === 0) return;
        let len = dataArray.length;
        let views = [];
        for (let i = 0, l = len; i < l; i += 2) {
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this.renderCheckBox(dataArray[i], i)}
                        {i + 1 < len && this.renderCheckBox(dataArray[i + 1], i + 1)}
                    </View>
                    <View style={styles.line} />
                </View>
            )
        }
        return views;
    }

    render() {
        let title = this.params.flag === FLAG_LANGUAGE.flag_language ? '语言排序' : '标签排序';
        let navigationBar = <NavigationBar
            title={title}
            leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
            style={{ backgroundColor: THEME_COLOR }}
            rightButton={ViewUtil.getRightButton('保存', () => this.onSave())}
        />;

        let listdata = {}
        this.state.checkedArray.map(item => {
            listdata[item.name] = item
        })
        let order = Object.keys(listdata)
        console.log('====================================');
        console.log(listdata);
        console.log('====================================');

        return (
            <View style={styles.container}>
                {navigationBar}
                <SortableListView
                    style={{ flex: 1 }}
                    data={listdata}
                    order={order}
                    onRowMoved={e => {
                        order.splice(e.to, 0, order.splice(e.from, 1)[0])
                        this.forceUpdate()
                    }}
                    renderRow={row => { console.log(row); return <SortCell data={row} {...this.params} />}}
                />
            </View>
        )
    }
}

const mapStateToProps = state => ({
    language: state.language
})

export default connect(
    mapStateToProps,
    {
        onLoadLanguage: actions.onLoadLanguage
    }
)(SortKeyPage)


class SortCell extends Component {
    render() {
        return <TouchableHighlight
            underlayColor={'#eee'}
            style={this.props.data.checked ? styles.item : styles.hidden}
            {...this.props.sortHandlers}>
            <View style={{ marginLeft: 10, flexDirection: 'row' }}>
                <MaterialCommunityIcons
                    name={'sort'}
                    size={16}
                    style={{ marginRight: 10, color: THEME_COLOR }} />
                <Text>{this.props.data.name}</Text>
            </View>
        </TouchableHighlight>
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    line: {
        flex: 1,
        height: 0.8,
        backgroundColor: 'darkgray',
    },
    hidden: {
        height: 0
    },
    item: {
        backgroundColor: "#F8F8F8",
        borderBottomWidth: 1,
        borderColor: '#eee',
        height: 50,
        justifyContent: 'center'
    },
})