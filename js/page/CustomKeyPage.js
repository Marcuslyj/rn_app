import React, { Component } from 'react'
import { View, ScrollView, StyleSheet, Alert } from 'react-native'
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

const THEME_COLOR = '#678'

class CustomKeyPage extends Component {
    constructor(props) {
        super(props);
        this.params = this.props.navigation.state.params;
        this.changeValues = [];
        this.isRemoveKey = !!this.params.isRemoveKey;
        this.languageDao = new LanguageDao(this.params.flag);
        this.state = {
            keys: []
        }
    }
    componentDidMount() {
        //如果props中标签为空则从本地存储中获取标签
        if (CustomKeyPage._keys(this.props).length === 0) {
            let { onLoadLanguage } = this.props;
            onLoadLanguage(this.params.flag);
        }
        this.setState({
            keys: CustomKeyPage._keys(this.props),
        })
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        if (prevState.keys !== CustomKeyPage._keys(nextProps, null, prevState)) {
            return {
                keys: CustomKeyPage._keys(nextProps, null, prevState),
            }
        }
        return null;
    }
    /**
     * 获取标签
     * @param {*} props 
     * @param {*} original 
     * @param {*} state 
     */
    static _keys(props, original, state) {
        const { flag, isRemoveKey } = props.navigation.state.params
        let key = flag === FLAG_LANGUAGE.flag_key ? "keys" : "languages";
        if (isRemoveKey && !original) {
            ;
        } else {
            return props.language[key];
        }
    }

    onBack() {
        if (this.changeValues.length > 0) {
            Alert.alert('提示', '要保存修改吗？',
                [
                    {
                        text: '否', onPress: () => {
                            NavigationUtil.goBack(this.props.navigation)
                        }
                    }, {
                        text: '是', onPress: () => {
                            this.onSave();
                        }
                    }
                ])
        } else {
            NavigationUtil.goBack(this.props.navigation)
        }
    }
    onSave() {
        if (this.changeValues.length === 0) {
            NavigationUtil.goBack(this.props.navigation);
            return;
        }
        let keys;
        // if (this.isRemoveKey) {//移除标签的特殊处理
        //     for (let i = 0, l = this.changeValues.length; i < l; i++) {
        //         ArrayUtil.remove(keys = CustomKeyPage._keys(this.props, true), this.changeValues[i], "name");
        //     }
        // }
        //更新本地数据
        this.languageDao.save(keys || this.state.keys);
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
        let title = this.isRemoveKey ? '标签移除' : '自定义标签';
        title = this.params.flag === FLAG_LANGUAGE.flag_language ? '自定义语言' : title;
        let rightButtonTitle = this.isRemoveKey ? '移除' : '保存';
        let navigationBar = <NavigationBar
            title={title}
            leftButton={ViewUtil.getLeftBackButton(() => this.onBack())}
            style={{ backgroundColor: THEME_COLOR }}
            rightButton={ViewUtil.getRightButton(rightButtonTitle, () => this.onSave())}
        />;

        return (
            <View style={styles.container}>
                {navigationBar}
                <ScrollView>
                    {this.renderView()}
                </ScrollView>
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
)(CustomKeyPage)


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        flexDirection: 'row',
    },
    line: {
        flex: 1,
        height: 0.8,
        backgroundColor: 'darkgray',
    }
})