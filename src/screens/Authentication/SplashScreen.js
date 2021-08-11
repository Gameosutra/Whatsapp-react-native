import React from 'react';
import { View, StyleSheet, Text, StatusBar, Dimensions, TouchableOpacity } from 'react-native';
import { Button } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

const SplashScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <Animatable.Image 
                    animation="bounceIn"
                    duration={1500}
                    source = {require('../../assets/logo.jpg')}
                    style={styles.logo}
                    resizeMode={"stretch"}
                />
            </View>
            <Animatable.View 
                animation="fadeInUpBig"
                style={styles.footer}>
                <Text style={styles.title}>
                    Recordसूची welcomes you!
                </Text>
                <Text style={styles.text}>
                    Sign In with account
                </Text>
                <View style={styles.button}>
                    <Button 
                        title="Get Started"
                        style={styles.button2}
                        icon = {
                            <MaterialIcons 
                                name="navigate-next"
                                color="white"
                                size={20}
                            />
                        }
                        iconRight
                        onPress={() => navigation.navigate("Signin")}
                    />
                </View>
            </Animatable.View>
        </View>
    );
}

SplashScreen.navigationOptions = ({ navigation }) => {
    return {
        header: () => false
    }
}

const {height} = Dimensions.get("screen");
const height_logo = height*0.7*0.4;

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: '#05375a'
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30
    },
    logo: {
        width: height_logo,
        height: height_logo,
        borderRadius: 10,
        backgroundColor: '#05375a'
    },title: {
        color: '#05375a',
        fontWeight: 'bold',
        fontSize: 40
    },
    text: {
        color: 'gray',
        marginTop: 15
    },
    button: {
        alignItems: 'flex-end',
        marginTop: 15
    },
    button2: {
        borderRadius: 100,
    }
});

export default SplashScreen;