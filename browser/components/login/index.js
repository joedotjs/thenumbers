import { Link } from 'react-router';

export default () => {
    return (
        <div id="login">
            <h1>
                To vote, login with <a target="_self" href="/auth/reddit">Reddit</a>
            </h1>
            <h3>or</h3>
            <h1>check out the <Link to="/rankings">rankings</Link></h1>
        </div>
    );
}