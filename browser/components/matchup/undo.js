import React from 'react';

export default class extends React.Component {

    constructor() {
        super();
        this._onClick = this._onClick.bind(this);
    }

    _onClick() {
        this.props.undo();
    }

    render() {
        return (
            <div id="undo-button" onClick={this._onClick}>
                <h3>Undo Last Vote</h3>
                <img src="http://simpleicon.com/wp-content/uploads/undo-4.svg" />
            </div>
        );
    }

}