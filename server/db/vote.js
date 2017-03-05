import db from './_db';
import Sequelize from 'sequelize';

const Vote = db.define('vote', {
    counted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
}, {
    classMethods: {
        getUncounted() {
            return this.findAll({
                where: {
                    counted: false
                },
                order: 'id ASC'
            });
        },
        setCountedBeforeId(id) {
            return this.update({
                counted: true
            }, {
                where: {
                    id: {$lte: id}
                }
            });
        }
    }
});

export default Vote;