import {
    createStackNavigator,
    createSwitchNavigator
} from 'react-navigation'

import WelcomePage from '../page/WelcomePage'
import HomePage from '../page/HomePage'
import DetailPage from '../page/DetailPage'
import AboutPage from '../page/about/AboutPage'


import FetchDemoPage from '../page/FetchDemoPage'
import DataStoreDemoPage from '../page/DataStoreDemoPage';


import { connect } from 'react-redux'
import { createReactNavigationReduxMiddleware, reduxifyNavigator } from 'react-navigation-redux-helpers'
import WebViewPage from '../page/WebViewPage';
import AboutMePage from '../page/about/AboutMePage';
import CustomKeyPage from '../page/CustomKeyPage'
import SortKeyPage from '../page/SortKeyPage';
import SearchPage from '../page/SearchPage';

const InitNavigator = createStackNavigator({
    WelcomePage: {
        screen: WelcomePage,
        navigationOptions: {
            header: null
        }
    }
})

const MainNavigator = createStackNavigator({
    HomePage: {
        screen: HomePage,
        navigationOptions: {
            header: null
        }
    },
    DetailPage: {
        screen: DetailPage,
        navigationOptions: {
            header: null
        }
    },
    WebViewPage: {
        screen: WebViewPage,
        navigationOptions: {
            header: null
        }
    },
    AboutPage: {
        screen: AboutPage,
        navigationOptions: {
            header: null
        }
    },
    AboutMePage: {
        screen: AboutMePage,
        navigationOptions: {
            header: null
        }
    },
    FetchDemoPage: {
        screen: FetchDemoPage,
        navigationOptions: {
            // header: null
        }
    },
    DataStoreDemoPage: {
        screen: DataStoreDemoPage
    },
    CustomKeyPage: {
        screen: CustomKeyPage,
        navigationOptions: {
            header: null
        }
    },
    SortKeyPage: {
        screen: SortKeyPage,
        navigationOptions: {
            header: null
        }
    },
    SearchPage: {
        screen: SearchPage,
        navigationOptions: {
            header: null
        }
    }

})

// 连接两个导航器
export const RootNavigator = createSwitchNavigator(
    {
        Init: InitNavigator,
        Main: MainNavigator
    },
    {
        navigationOptions: {
            header: null
        }
    }
)

export const rootCom = 'Init'   //设置根路由

export const middleware = createReactNavigationReduxMiddleware(
    'root',
    state => state.nav
)

const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root')

const mapStateToProps = state => ({
    state: state.nav
})

export default connect(mapStateToProps)(AppWithNavigationState)