import React, { useState, useContext} from 'react';
import { Input, Button, Text } from 'react-native-elements';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView, NavigationEvents } from 'react-navigation';
import { Context as AuthContext } from '../context/AuthContext';
import { Context as BusinessContext } from '../context/BusinessContext';
import Spacer from '../components/Spacer';

const BusinessCreateScreen = () => {
    const { signout } = useContext(AuthContext);
    const { state, createBusiness, clearErrorMessage } = useContext(BusinessContext);
    const [ businessName, setBusinessName ] = useState('');
    const [ brandName, setBrandName ] = useState('');
    const [ city, setCity ] = useState('');
    const [ stateBuisness, setState ] = useState('');
    const [ address, setAddress ] = useState('');
    const [ concernedPerson, SetPerson ] = useState('');
    return (
        <ScrollView>
            <NavigationEvents onWillBlur={clearErrorMessage} />
            <SafeAreaView forceInset = {{ top: 'always' }}>
                <Text h4>
                    Create Business
                </Text>
                <Spacer />
                <Input 
                    autoCapitalize = "none"
                    autoCorrect = {false}
                    label="Business Name" 
                    value={businessName} 
                    onChangeText = {setBusinessName}
                    />
                    <Spacer />
                <Input 
                    autoCapitalize = "none"
                    autoCorrect = {false}
                    label="Brand Name" 
                    value={brandName} 
                    onChangeText = {setBrandName}
                    />
                <Spacer />
                <Input 
                    autoCapitalize = "none"
                    autoCorrect = {false}
                    label="City" 
                    value={city} 
                    onChangeText = {setCity} 
                    />
                <Spacer />
                <Input 
                    autoCapitalize = "none"
                    autoCorrect = {false}
                    label="State" 
                    value={stateBuisness} 
                    onChangeText = {setState} 
                    />
                    <Spacer />
                <Input 
                    autoCapitalize = "none"
                    autoCorrect = {false}
                    label="Address" 
                    value={address} 
                    onChangeText = {setAddress} 
                    />
                    <Spacer />
                <Input 
                    autoCapitalize = "none"
                    autoCorrect = {false}
                    label="Concerned Person Name" 
                    value={concernedPerson} 
                    onChangeText = {SetPerson} 
                    />
                    <Spacer />
                {state.errorMessage ? <Text style={styles.error}>{state.errorMessage}</Text> : null}
                <Spacer>
                    <Button title="Save Details"
                    onPress = {() => {
                        createBusiness({ businessName, brandName, city, stateBuisness, address, concernedPerson })
                    }} />
                </Spacer>
                <Spacer />
                <Button title="LOGOUT" onPress={signout} />
            </SafeAreaView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    error: {
        color: 'red',
        fontSize: 16,
        marginLeft: 15,
        marginTop: 15
    },
});

export default BusinessCreateScreen;