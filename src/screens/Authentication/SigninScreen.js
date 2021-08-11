import React, { useContext, useState } from 'react';
import { NavigationEvents } from 'react-navigation';
import { View, StyleSheet, TextInput } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { Context as AuthContext } from '../../context/AuthContext';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';

const SigninScreen = ({ navigation }) => {
    const { state, signin, clearErrorMessage } = useContext(AuthContext);
    const [ phone,setPhone ] = useState('7838902470');
    const [ password,setPassowrd ] = useState('harshit');
    const [ secureEntry, setSecureTextEntry ] = useState(true);
    const setSecureState = () => {
        setSecureTextEntry(!secureEntry);
    }
    return (
            <View style={styles.container}>
                <NavigationEvents onWillBlur={ clearErrorMessage } onWillFocus={ clearErrorMessage } />
                <View style={styles.header}>
                   <TouchableOpacity onPress={()=>navigation.navigate("Splash")}>
                       <Text style={styles.text_header}>Sign In</Text>
                    </TouchableOpacity>
                </View>
                <Animatable.View duration={600} animation="fadeInUpBig" style={styles.footer}>
                    <Text style={styles.text_footer}>Phone</Text>
                    <View style={styles.action}>
                        <FontAwesome name="user-o" color="#05375a" size={20} />
                        <TextInput placeholder="Enter Phone"
                            keyboardType={'phone-pad'}
                            style={styles.textInput}    
                            value={phone} 
                            onChangeText = {setPhone} 
                        />
                        <Feather name="check-circle" color="green" size={20} /> 
                    </View>

                    <Text style={[styles.text_footer,{
                        marginTop: 35
                    }]}>Password</Text>
                    <View style={styles.action}>
                        <Feather name="lock" color="#05375a" size={20} />
                        {secureEntry ? <TextInput placeholder="Enter Password"
                            style={styles.textInput} 
                            autoCapitalize = "none"
                            autoCorrect = {false}
                            value={password} 
                            onChangeText = {setPassowrd}
                            secureTextEntry    
                        /> :
                        <TextInput placeholder="Enter Password"
                            style={styles.textInput} 
                            autoCapitalize = "none"
                            autoCorrect = {false}
                            value={password} 
                            onChangeText = {setPassowrd}
                            secureTextEntry = {false} 
                        /> }
                        <TouchableOpacity onPress={() => {
                            setSecureState();
                        }}>
                            { secureEntry ? 
                                <Feather 
                                    name="eye-off" 
                                    color="gray" 
                                    size={20} 
                                /> : 
                                <Feather 
                                    name="eye" 
                                    color="gray" 
                                    size={20} 
                                /> 
                            } 
                        </TouchableOpacity> 
                    </View>
                    <TouchableOpacity onPress={()=>navigation.navigate("Signup")}><Text style={{color: '#809bd1', marginTop: 20}}>Don't have an account? SignUp</Text></TouchableOpacity>
                        { state.errorMessage ? <Text style={styles.error}> {state.errorMessage}</Text> : null}
                    <View style={styles.button}>
                        <Button title="Sign In" 
                            onPress = {() => {
                                signin({ phone, password });
                            }} 
                            loading = {state.loader}
                        />
                    </View>
                </Animatable.View>
            </View>
    );
}
SigninScreen.navigationOptions = () => {
    return {
        header: () => false
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#05375a'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 3,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: 'white',
        fontSize: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        marginTop: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
        flexDirection:'row'
    },
    textInput: {
        flex: 1,
        paddingLeft: 10,
        color: '#05375a'
    },
    button: {
        marginTop: 30,
    },
    error: {
        fontSize: 15,
        color: 'red',
        marginTop: 20
    }
});

export default SigninScreen;