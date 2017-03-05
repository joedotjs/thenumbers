const orders = [
    'Wins',
    'Wins B-Sides',
    'ELO',
    'Personal'
];

const filters = [
    'All',
    'No B-Sides',
    'Pablo Honey',
    'The Bends',
    'OK Computer',
    'Kid A',
    'Amnesiac',
    'Hail to the Thief',
    'In Rainbows',
    'The King of Limbs',
    'A Moon Shaped Pool',
    'B-Sides'
];

import React from 'react';
import Option from './option';

export default class extends React.Component {

    isActiveFilter(filter) {

        if (filter === 'All') {
            return this.props.currentFilter === null;
        }

        return filter === this.props.currentFilter;

    }

    isActiveOrder(order) {
        return order === this.props.currentOrder;
    }

    makeFilterButtons() {
        return filters.map(filter =>
            <Option
                key={filter}
                text={filter}
                setOption={this.props.setFilter}
                active={this.isActiveFilter(filter)} />
        );
    }

    makeOrderButtons() {
        return orders.map(order =>
            <Option
                key={order}
                text={order}
                setOption={this.props.setOrder}
                active={this.isActiveOrder(order)}
            />
        );
    }

    render() {
        return (
            <div id="order-and-filter">
                <ul id="order-filter">
                    {this.makeOrderButtons()}
                </ul>
                <ul id="ranking-filter">
                    {this.makeFilterButtons()}
                </ul>
            </div>
        );
    }

}