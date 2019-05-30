import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { PropTypes } from 'prop-types'

export default class BaseItem extends Component {
    static propTypes = {
        projectModel: PropTypes.object,
        onSelect: PropTypes.func,
        onFavorite: PropTypes.func
    }
    constructor(props) {
        super(props)
        this.state = {
            isFavorite: this.props.projectModel.isFavorite
        }
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        const isFavorite = nextProps.projectModel.isFavorite
        if (prevState.isFavorite !== isFavorite) {
            return {
                isFavorite: isFavorite
            }
        }
        return null
    }
    // favoriteIcon(){
    //     return 
    // }

}

const styles = StyleSheet.create({

})