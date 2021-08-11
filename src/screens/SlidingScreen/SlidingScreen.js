import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default class SlidingScreen extends Component {
    state = {
        active: 0,
        xTabOne: 0,
        xTabTwo: 0,
        translateX: new Animated.Value(0),
        translateXTabOne: new Animated.Value(0),
        translateXTabTwo: new Animated.Value(width),
        translateY: -1000
    }

    handleSlide = (type) => {
        let { translateX, active, translateXTabOne, translateXTabTwo } = this.state;
        Animated.spring(translateX, {
            toValue: type,
            duration: 100,
            useNativeDriver: true
        }).start();

        if(active === 0) {
            Animated.parallel([
                Animated.spring(translateXTabOne, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true
                }).start(),
                Animated.spring(translateXTabTwo, {
                    toValue: width,
                    duration: 100,
                    useNativeDriver: true
                }).start()
            ])
        } else {
            Animated.parallel([
                Animated.spring(translateXTabOne, {
                    toValue: -width,
                    duration: 100,
                    useNativeDriver: true
                }).start(),
                Animated.spring(translateXTabTwo, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true
                }).start()
            ])
        }
    }

    render() {
        let { xTabOne, xTabTwo, translateX, active, translateXTabOne, translateXTabTwo, translateY } = this.state;
        return (
            <View style={{flex:1}}>
                <View style={{width: '90%', marginLeft:"auto", marginRight:'auto'}}>
                    <View style={{flexDirection:"row", marginTop:20,marginBottom: 20, height: 36, position: 'relative' }} >
                        <Animated.View style={{position: 'absolute', width: "50%", height: "100%", top:0, left: 0, backgroundColor: '#0D93B3', borderRadius: 4, transform: [{ translateX }]}} />
                        <TouchableOpacity onLayout={(event) => {
                            this.setState({
                                xTabOne: event.nativeEvent.layout.x
                            })
                        }} onPress={() => {
                            this.setState({active: 0}, () => {
                                this.handleSlide(xTabOne)
                            })
                        }} style={{flex:1, justifyContent: 'center',alignItems: 'center',borderWidth: 1, borderColor: '#0D93B3', borderRadius: 4, borderRightWidth: 0, borderTopRightRadius: 0,borderBottomRightRadius: 0}}>
                            <Text style={{color: active === 0 ? 'white' : '#0D93B3'}}>{this.props.firstComponentHeader}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onLayout={(event) => {
                            this.setState({
                                xTabTwo: event.nativeEvent.layout.x
                            })
                        }} onPress={() => {
                            this.setState({active: 1}, () => {
                                this.handleSlide(xTabTwo)
                            })
                        }} style={{flex:1, justifyContent: 'center',alignItems: 'center',borderWidth: 1, borderColor: '#0D93B3', borderRadius: 4, borderLeftWidth: 0, borderTopLeftRadius: 0,borderBottomLeftRadius: 0}}>
                            <Text style={{color: active === 1 ? 'white' : '#0D93B3'}}>{this.props.secondComponentHeader}</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView>
                        <Animated.View style={{
                            // justifyContent: 'center',
                            // alignItems: 'center',
                            transform: [{
                                translateX: translateXTabOne
                            }]
                        }}
                            onLayout={(event) => this.setState({translateY: event.nativeEvent.layout.height})}
                        >
                            {this.props.firstComponent}
                        </Animated.View>
                        <Animated.View style={{
                            // justifyContent: 'center',
                            // alignItems: 'center',
                            transform: [{translateX: translateXTabTwo},{translateY: -translateY}]
                        }}>
                            {this.props.secondComponent}
                        </Animated.View>
                    </ScrollView>
                </View>
            </View>
        )
    }
}