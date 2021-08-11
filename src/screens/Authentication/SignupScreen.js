import React, { useContext, useState } from 'react';
import { NavigationEvents } from 'react-navigation';
import { View, StyleSheet, TextInput, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-elements';
import { Context as AuthContext } from '../../context/AuthContext';
import { FontAwesome, Feather, MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';

const SignupScreen = ({ navigation }) => {
    const { state, signup, clearErrorMessage } = useContext(AuthContext);
    const [email,setEmail] = useState('');
    const [ phone,setPhone ] = useState('');
    const [password,setPassowrd] = useState('');
    const [cpassword,setCpassword] = useState('');
    const [firstName,setFirstName] = useState('');
    const [lastName,setLastName] = useState('');
    const [loader, setLoader] = useState(false);
    const [ secureEntry, setSecureTextEntry ] = useState(true);
    const [ secureEntryP, setSecureTextEntryP ] = useState(true);
    const setSecureState = () => {
        setSecureTextEntry(!secureEntry);
    }
    const setSecureStateP = () => {
        setSecureTextEntryP(!secureEntryP);
    }
    return (
            <View style={styles.container}>
                <NavigationEvents onWillBlur={ clearErrorMessage } onWillFocus={ clearErrorMessage } />
                <View style={styles.header}>
                   <TouchableOpacity onPress={()=>navigation.navigate("Splash")}>
                       <Text style={styles.text_header}>Register Now</Text>
                    </TouchableOpacity>
                </View>
                <Animatable.View duration={600} animation="fadeInUpBig" style={styles.footer}>
                    <ScrollView>
                        <Text style={styles.text_footer}>First Name</Text>
                        <View style={styles.action}>
                            <MaterialIcons name="person" color="#05375a" size={20} />
                            <TextInput placeholder="Enter First Name"
                                autoCapitalize = "none"
                                autoCorrect = {false}
                                style={styles.textInput}    
                                value={firstName} 
                                onChangeText = {setFirstName} 
                            /> 
                        </View>

                        <Text style={[styles.text_footer,{
                            marginTop: 35
                        }]}>Last Name</Text>
                        <View style={styles.action}>
                            <MaterialIcons name="person" color="#05375a" size={20} />
                            <TextInput placeholder="Enter Last Name"
                                autoCapitalize = "none"
                                autoCorrect = {false}
                                style={styles.textInput}    
                                value={lastName} 
                                onChangeText = {setLastName} 
                            /> 
                        </View>

                        <Text style={[styles.text_footer,{
                            marginTop: 35
                        }]}>Phone Number</Text>
                        <View style={styles.action}>
                            <FontAwesome name="user-o" color="#05375a" size={20} />
                            <TextInput placeholder="Enter Phone Number"
                                style={styles.textInput}
                                keyboardType="numeric"    
                                value={phone} 
                                onChangeText = {setPhone} 
                            />
                            <Feather name="check-circle" color="green" size={20} /> 
                        </View>

                        <Text style={[styles.text_footer,{
                            marginTop: 35
                        }]}>Email</Text>
                        <View style={styles.action}>
                            <FontAwesome name="user-o" color="#05375a" size={20} />
                            <TextInput placeholder="Enter Email"
                                autoCapitalize = "none"
                                autoCorrect = {false}
                                style={styles.textInput}    
                                value={email} 
                                onChangeText = {setEmail} 
                            />
                            <Feather name="check-circle" color="green" size={20} /> 
                        </View>

                        <Text style={[styles.text_footer,{
                            marginTop: 35
                        }]}>Password</Text>
                        <View style={styles.action}>
                            <Feather name="lock" color="#05375a" size={20} />
                            { secureEntry ? <TextInput placeholder="Enter Password"
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
                            /> }
                            <TouchableOpacity onPress={() => {
                                setSecureState();
                            }}>
                                {secureEntry ? <Feather name="eye-off" color="gray" size={20} /> : <Feather name="eye" color="gray" size={20} />}
                            </TouchableOpacity>    
                        </View>

                        <Text style={[styles.text_footer,{
                            marginTop: 35
                        }]}>Confirm Password</Text>
                        <View style={styles.action}>
                            <Feather name="lock" color="#05375a" size={20} />
                            { secureEntryP ? <TextInput placeholder="Enter Confirm Password"
                                style={styles.textInput} 
                                autoCapitalize = "none"
                                autoCorrect = {false}
                                value={cpassword} 
                                onChangeText = {setCpassword}
                                secureTextEntry    
                            /> : 
                            <TextInput placeholder="Enter Confirm Password"
                                style={styles.textInput} 
                                autoCapitalize = "none"
                                autoCorrect = {false}
                                value={cpassword} 
                                onChangeText = {setCpassword}
                            />
                            }
                            <TouchableOpacity onPress={() => {
                                setSecureStateP();
                            }}>
                                {secureEntryP ? <Feather name="eye-off" color="gray" size={20} /> : <Feather name="eye" color="gray" size={20} />}
                            </TouchableOpacity> 
                        </View>
                        <TouchableOpacity onPress={()=>navigation.navigate("Signin")}><Text style={{color: '#809bd1', marginTop: 20}}>Already have an account? SignIn</Text></TouchableOpacity>
                        { state.errorMessage ? <Text style={styles.error}>{state.errorMessage}</Text> : null}
                        <View style={styles.button}>
                            <Button title="Sign Up" 
                                onPress = {() => {
                                    signup({ firstName, lastName,phone, email, password, cpassword });
                                    setLoader(true);
                                }} 
                                loading = {loader}
                            />
                        </View>
                    </ScrollView>
                </Animatable.View>
            </View>
    );
}
SignupScreen.navigationOptions = () => {
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
        flex: 7,
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

export default SignupScreen;