import db from './_db';

import Album from './album';
import Song from './song';
import Vote from './vote';
import User from './user';

Song.belongsTo(Album);
Album.hasMany(Song);

Vote.belongsTo(Song, {as: 'choice1'});
Vote.belongsTo(Song, {as: 'choice2'});
Vote.belongsTo(Song, {as: 'chosen'});
Vote.belongsTo(User, {as: 'voter'});

export default db;