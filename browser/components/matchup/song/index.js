import React from 'react';

export default class extends React.Component {

    constructor() {
        super();
        this.vote = this.vote.bind(this);
    }

    vote() {
        this.props.vote(this.props.id);
    }

    getBackground() {
        return {
            background: this.props.pressed ? '#333' : undefined
        };
    }

    render() {
        return (
            <div className="song" style={this.getBackground()} onClick={this.vote}>
                <img src={this.props.album.cover} />
                <div className="details">
                    <h1>{this.props.title}</h1>
                    <h2>{this.props.album.title}</h2>
                </div>
            </div>
        );
    }

}