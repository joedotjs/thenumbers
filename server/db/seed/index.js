import db from '..';
import { Promise } from 'sequelize';
import songs from './songs';
import zip from 'lodash/zip';
const User = db.model('user');
const Song = db.model('song');
const Album = db.model('album');
const Vote = db.model('vote');

const mapInsert = (records, model) => {
    return Promise.all(records.map(record => {
        return model.create(record);
    }));
};

const albums = zip([
    'Pablo Honey',
    'The Bends',
    'OK Computer',
    'Kid A',
    'Amnesiac',
    'Hail to the Thief',
    'In Rainbows',
    'The King of Limbs',
    'A Moon Shaped Pool'
], [
    'http://img2-ak.lst.fm/i/u/770x0/f78e87f3ecef4a4b81ec7285ae9882c0.jpg',
    'http://img2-ak.lst.fm/i/u/ar0/9421beaa754748d1b09236f57e3532c6',
    'http://img2-ak.lst.fm/i/u/770x0/498206d571474370a08a81deaba5f176.jpg',
    'http://img2-ak.lst.fm/i/u/ar0/2ed343318c844d19cd897ec67fad11c4',
    'http://img2-ak.lst.fm/i/u/ar0/0b048bb20da240079c35329b19483bef',
    'http://img2-ak.lst.fm/i/u/770x0/d85c9d5f92f648a4b10cecf353149fe9.jpg',
    'http://img2-ak.lst.fm/i/u/ar0/8d91b7dd13084606b99d756175917f7d',
    'http://img2-ak.lst.fm/i/u/ar0/f47f0408a925403cbea2564add58000f',
    'http://img2-ak.lst.fm/i/u/ar0/267decde8626b1263f0e3fcb3f43bc4a'
]).map(a => ({ title: a[0], cover: a[1] }));

const formattedSongs = songs.map((group, i) => {
    return group.map(s => ({ title: s, albumId: i + 1 }));
}).reduce((allSongs, group) => {
    return allSongs.concat(group);
});

const sync = () => {
    const force = true;
    return User.sync({force})
        .then(() => Album.sync({force}))
        .then(() => Song.sync({force}))
        .then(() => Vote.sync({force}));
};

sync()
    .then(() => mapInsert(albums, Album))
    .then(() => mapInsert(formattedSongs, Song))
    .catch(e => {
        console.error(e.stack);
    });