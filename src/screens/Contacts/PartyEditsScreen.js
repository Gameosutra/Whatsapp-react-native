import React, { useContext } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { NavigationEvents } from 'react-navigation';

import { Context as PartyContext } from '../../context/PartyContext';
import PartyForm from './components/contactForm';

const ProductEditScreen = ({ navigation }) => {
    const { state, editParty, clearErrorMessage } = useContext(PartyContext);
    let party;
    if (state.currentParty) {
        party = state.currentParty;
    } else {
        party = {
            businessName: '',
            phone: '',
            brandName:'',
            state:'',
            city:''
        };
    }
    return (
            <ScrollView>
            <NavigationEvents onWillBlur={clearErrorMessage}  />
            <PartyForm 
                error={state.errorMessage}
                party={party}
                onSubmit={(businessName, phone, brandName, city, state) => {
                    editParty({party, businessName, phone, brandName, city, state}) 
                }} 
                onSubmitButton="Update Party"
                title="Edit Party"
                loader = {state.loader}
                />
        </ScrollView>
    );
}

ProductEditScreen.navigationOptions = () => {
    return {
        header: () => false
    }
}

const styles = StyleSheet.create({

});

export default ProductEditScreen;