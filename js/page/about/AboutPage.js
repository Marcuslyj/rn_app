
import React, { Component } from 'react';
import {View} from 'react-native';
import NavigationUtil from '../../navigator/NavigationUtil';
import { MORE_MENU } from '../../common/MORE_MENUE';
import GlobalStyles from '../../res/styles/GlobalStyles';
import ViewUtil from '../../util/ViewUtil';
import AboutCommon, { FLAG_ABOUT } from './AboutCommon';
import config from '../../res/data/config'


// const THEME_COLOR = 'orange'
const THEME_COLOR = '#678'

export default class AboutPage extends Component {
    constructor(props) {
        super(props)
        this.params = this.props.navigation.state.params
        this.aboutCommon = new AboutCommon({
            ...this.params,
            navigation: this.props.navigation,
            flagAbout: FLAG_ABOUT.flag_about
        }, data => {
            this.setState({ ...data })
        })
        this.state = {
            data: config
        }
    }

    onClick(menu) {
        let RouteName, params = {}
        switch (menu) {
            // case MORE_MENU.About:
            //     RouteName = 'AboutPage'
            //     break
            case MORE_MENU.Tutorial:
                RouteName = 'WebViewPage'
                params.title = '教程'
                params.url = 'https://coding.m.imooc.com/classindex.html?cid=89'
                break
            // case MORE_MENU.Custom_Theme:
            //     const { onShowCustomThemeView } = this.props
            //     onShowCustomThemeView(true)
            //     break
            // case MORE_MENU.CodePush:
            //     RouteName = 'CodePushPage'
            //     break
            // case MORE_MENU.Sort_Key:
            //     RouteName = 'SortKeyPage'
            //     params.flag = FLAG_LANGUAGE.flag_key
            //     break
            // case MORE_MENU.Sort_Language:
            //     RouteName = 'SortKeyPage'
            //     params.flag = FLAG_LANGUAGE.flag_language
            //     break
            // case MORE_MENU.Custom_Key:
            // case MORE_MENU.Custom_Language:
            // case MORE_MENU.Remove_Key:
            //     RouteName = 'CustomKeyPage'
            //     RouteName = 'CustomKeyPage'
            //     params.isRemoveKey = menu === MORE_MENU.Remove_Key
            //     params.flag = menu !== MORE_MENU.Custom_Language ? FLAG_LANGUAGE.flag_key : FLAG_LANGUAGE.flag_language
            //     break
            // case MORE_MENU.About_Author:
            //     RouteName = 'AboutMePage'
            //     break
            default:
                break
        }
        if (RouteName) {
            NavigationUtil.goPage(params, RouteName);
        }
    }
    getItem(menu) {
        const { theme } = this.props;
        return ViewUtil.getMenuItem(() => this.onClick(menu), menu, THEME_COLOR);
    }
    render() {
        const content = (
            <View>
                {this.getItem(MORE_MENU.Tutorial)}
                <View style={GlobalStyles.line} />
                {this.getItem(MORE_MENU.About_Author)}
                <View style={GlobalStyles.line} />
                {this.getItem(MORE_MENU.Feedback)}
            </View>
        )
        return this.aboutCommon.render(content, this.state.data.app)
    }
}