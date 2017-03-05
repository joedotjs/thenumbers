import db from './_db';
import Sequelize from 'sequelize';
import Album from './album';
import Vote from './vote';

const Song = db.define('song', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    rating: {
        type: Sequelize.INTEGER(4),
        defaultValue: 1500
    }
}, {
    defaultScope: {
        include: [
            {model: Album}
        ]
    },
    classMethods: {
        getRanked() {
            return this.findAll({
                order: 'rating DESC'
            });
        },
        rankedByWins() {
            return Vote.findAll({
                attributes: {
                    include: [
                        [db.fn('count', '*'), 'wins']
                    ]
                },
                include: [
                    {model: Song, as: 'chosen'}
                ],
                group: ['chosenId'],
                order: 'wins DESC'
            })
            .then(results => {
                return results.map(r => {
                    const obj = r.toJSON();
                    return Object.assign({}, obj.chosen, {wins: obj.wins})
                })
            });
        }
    }
});
export default Song;