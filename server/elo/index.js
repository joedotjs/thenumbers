const K_FACTOR = 32;

const calculate = function (mRating, oRating, mWin) {
    const winChance = 1 / (1 + Math.pow(10, (oRating - mRating) / 400));
    return mRating + Math.round(K_FACTOR * (mWin - winChance));
};

export default function (song1Rating, song2Rating, firstSongWon) {
    return [
        calculate(song1Rating, song2Rating, ~~firstSongWon), // cast Boolean to 0/1
        calculate(song2Rating, song1Rating, ~~(!firstSongWon))
    ];
};