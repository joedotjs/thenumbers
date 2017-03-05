import db from '../';

const Song = db.model('song');
const Album = db.model('album');

const songs = `Spectre
Staircase
The Daily Mail
The Butcher
Supercollider
These Are My Twisted Words
Harry Patch (In Memory Of)
MK 1
Down Is the New Up
Go Slowly
MK 2
Last Flowers
Up on the Ladder
Bangers + Mash
4 Minute Warning
I Want None of This
Where Bluebirds Fly
I Am a Wicked Child
I Am Citizen Insane
Gagging Order
Paperbag Writer
Cuttooth
Fast Track
Trans-Atlantic Drawl
Worrywort
Kinetic
Fog
The Amazing Sounds of Orgy
True Love Waits [Live]
Lull
Polyethylene (Parts 1 & 2)
How I Made My Millions
Meeting in the Aisle
Palo Alto
A Reminder
Melatonin
Pearly
Lewis (Mistreated)
Maquiladora
How Can You Be Sure?
Banana Co.
Molasses
Killer Cars
India Rubber
You Never Wash Up After Yourself
Talk Show Host
Punchdrunk Lovesick Singalong
Bishop's Robes
Lozenge of Love
The Trickster
Permanent Daylight
Pop Is Dead
Inside My Head
Stupid Car
Yes I Am
Coke Babies
Faithless, the Wonderboy
Million Dollar Question`.split('\n');

Album.create({
        title: 'B-Sides',
        cover: 'http://i.imgur.com/Bz85Uou.png'
    })
    .then(album => {
        return Song.bulkCreate(songs.map(title => ({title, albumId: album.id})));
    })
    .then(() => console.log('Done!'));

