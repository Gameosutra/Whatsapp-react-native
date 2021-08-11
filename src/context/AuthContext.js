import createDataContext from './createDataContext';
import trackerApi from '../api/tracker';
import { AsyncStorage } from 'react-native';
import { navigate } from '../navigationRef';
import Toast from 'react-native-toast-message';

const authReducer = (state, action) => {
    switch (action.type) {
        case 'setLoader':
            return { ...state, loader: true }
        case 'signout':
            return { token: '', errorMessage: '' }
        case 'clear_error_message':
            return { ...state, errorMessage: '', loader: false }
        case 'signin':
            return { errorMessage: '', token: action.payload.token, user: action.payload.user, loader: false }
        case 'signup':
            return { errorMessage: '', loader: false }
        case 'add_error':
            return { ...state, errorMessage: action.payload, loader: false }
        default:
            return state;
    }
};

const tryLocalSignin = dispatch => async () => {
    const token = await AsyncStorage.getItem('token');
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    if (token) {
        dispatch({ type: 'signin', payload: { token: token, user: user } });
        navigate('HomePage');
    } else {
        navigate('Signin');
    }
}

const clearErrorMessage = dispatch => () => {
    dispatch({ type: 'clear_error_message' })
}

const signup = (dispatch) => async (obj) => {
    dispatch({ type: 'setLoader' });
    try {
        await trackerApi.post('/api/signup', obj);
        dispatch({ type: 'signup' });

        Toast.show({
            type: 'success',
            text1: response.data.message
        });
        //navigate to main flow
        navigate('Signin');

    } catch (err) {
        console.log("err err", err.response.data.message);
        Toast.show({
            type: 'error',
            text1: err.response.data.message
        });
        dispatch({ type: 'add_error', payload: 'Something went wrong with Sign Up' });
    };
};

const signin = (dispatch) => async (obj) => {
    dispatch({ type: 'setLoader' });
    try {
        let config = {

            headers: {
                'Content-Type': 'application/json'
            }
        };
        const response = await trackerApi.post('/api/signin', JSON.stringify(obj), config);
        await AsyncStorage.setItem('token', response.data.data.accessToken);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.data));
        dispatch({ type: 'signin', payload: { token: response.data.data.accessToken, user: response.data.data } });
        if (!response.data.data.business) {
            navigate('BusinessCreate');
        } else {
            navigate('HomePage');
        }
        Toast.show({
            type: 'success',
            text1: response.data.message
        });
    } catch (err) {
        Toast.show({
            type: 'error',
            text1: err.response.data.message
        });
        dispatch({ type: 'add_error' });
    }
}

const signout = (dispatch) => async () => {
    await AsyncStorage.removeItem('token');
    dispatch({ type: 'signout' });
    navigate('Signin');
    Toast.show({
        type: 'success',
        visibilityTime: 2000,
        text1: "Successfully Logged Out"
    });
}


export const { Provider, Context } = createDataContext(
    authReducer,
    { signin, signout, signup, clearErrorMessage, tryLocalSignin },
    { token: null, errorMessage: '', user: null, loader: false }
)