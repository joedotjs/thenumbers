import React from 'react';

export default class extends React.Component {

    constructor() {
        super();
        this.includeBSides = this.includeBSides.bind(this);
        this.excludeBSides = this.excludeBSides.bind(this);
    }

    setInclude(include) {
        if (this.isActive(include)) return;
        this.props.set(include);
    }

    includeBSides(include) {
        return this.setInclude(true);
    }

    excludeBSides(include) {
        return this.setInclude(false);
    }

    isActive(bool) {
        return this.props.include === bool;
    }

    render() {
        return (
            <h3 id="include-bsides">
                <span>Include B-Sides?</span>
                <span
                    className={this.isActive(true) ? 'active' : null}
                    onClick={this.includeBSides}>
                    Yes
                </span>
                <span
                    className={this.isActive(false) ? 'active' : null}
                    onClick={this.excludeBSides}>
                    No
                </span>
            </h3>
        );
    }

}