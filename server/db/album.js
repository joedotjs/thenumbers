import db from './_db';
import Sequelize from 'sequelize';

const Album = db.define('album', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    cover: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

export default Album;
