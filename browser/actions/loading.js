import store from '../store/createStore';
const { dispatch } = store;

export function loading() {
    dispatch({ type: 'SET_IS_LOADING' });
}