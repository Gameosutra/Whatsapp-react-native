import createDataContext from './createDataContext';
import TrackerApi from '../api/tracker';
import { AsyncStorage } from 'react-native';
import { navigate } from '../navigationRef';

const BusinessReducer = (state, action) => {
    switch(action.type) {
        case 'business_update':
            return { ...state, errorMessage: '', user: action.payload };
        case 'business': 
            return { errorMessage: '', user: action.payload.user, token: action.payload.token };
        case 'clear_error_message':
            return { ...state, errorMessage: ''};
        case 'add_error':
            return { ...state, errorMessage: action.payload };
        default: 
            return state;
    };
};

const clearErrorMessage = dispatch => () => {
    dispatch({ type: 'clear_error_message' })
}

const createBusiness = dispatch => async ( { businessName, brandName, city, stateBuisness, address, concernedPerson } ) => {
    try {
        const response = await TrackerApi.post('/api/create-business', { businessName, brandName, city, state: stateBuisness, address, concernedPerson });
        await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
        await AsyncStorage.setItem('token', response.data.data.user.accessToken);
        dispatch({ type: 'business', payload: { user: response.data.data.user, token: response.data.data.user.accessToken} });
        navigate('HomePage')
    } catch (err) {
        dispatch({ type: 'add_error', payload: 'Something went wrong with Business Creation'});
    }
    
};
const editBusiness = dispatch => async ( {business, businessName, brandName, city, stateBuisness, address, concernedPerson} ) => {
    try {
        const response = await TrackerApi.put('/api/business/'+ business._id, {businessName, brandName, city, state: stateBuisness, address, concernedPerson});
        const user = JSON.parse(await AsyncStorage.getItem('user'));
        user.business = response.data.data;
        dispatch({ type: 'business_update', payload: user });
        navigate('HomePage')
    } catch (err) {
        dispatch({ type: 'add_error', payload: 'Something went wrong with Business Creation'});
    }
};

export const { Provider, Context } = createDataContext(
    BusinessReducer,
    { createBusiness, editBusiness, clearErrorMessage },
    { errorMessage: '', user: null, token: null }
)
