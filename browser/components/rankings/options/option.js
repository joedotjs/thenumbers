import React from 'react';

export default class extends React.Component {

    constructor() {
        super();
        this._onClick = this._onClick.bind(this);
    }

    _onClick() {
        this.props.setOption(this.props.text);
    }

    render() {
        return (
            <li
                onClick={this._onClick}
                className={this.props.active ? 'active' : null}>
                {this.props.text}
            </li>
        );
    }

}