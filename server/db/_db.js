import Sequelize from 'sequelize';

const db = new Sequelize({
    dialect: 'sqlite',
    storage: 'rh.sqlite',
    logging: false
});

export default db;