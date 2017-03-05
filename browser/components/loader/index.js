const imgURL = 'https://66.media.tumblr.com/be166d106845279f1eb30308ffa2a493/tumblr_mzcrcxHdQs1s682qho1_400.gif';

export default () => {
    return (
        <div id="such-a-pretty-loader">
            <div id="loader-overlay"></div>
            <img src={imgURL} />
        </div>
    );
}