import React, { useContext, useEffect } from 'react';
import { View, StyleSheet, FlatList, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar, Text } from 'react-native';
import Spacer from '../../components/Spacer';
import { NavigationEvents } from 'react-navigation';
import { Feather } from '@expo/vector-icons';
import * as Animatable from "react-native-animatable";
import { ListItem, Avatar } from 'react-native-elements'

import { Context as InventoryContext } from '../../context/InventoryContext';

const InventoryDetailScreen = ({ navigation, route }) => {
    const { state, getInventoryLogs } = useContext(InventoryContext);
    const _id = route.params._id;
    if(_id) {
        useEffect(() => {
            getInventoryLogs(_id);
        }, [])
    }
    const reason = route.params.reason;
    
    if (state.inventoryLoader) {
        return (
            <View>
                <ActivityIndicator size="large" style={{ marginTop: 200 }} />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Animatable.View
                animation="fadeInDown"
                duration={600}
                style={styles.header}
            >
                <Text style={styles.header_text}>{_id}</Text>
                <Text style = {styles.header_text}>{reason}</Text>
            </Animatable.View>
            <View style={styles.footer}>
            <FlatList
          data={state.logs}
          keyExtractor={item => item._id}
          renderItem={({ item }) => {
            return (
                <ListItem bottomDivider>
                  <Avatar style={styles.avtar} title="IA" />
                  <ListItem.Content>
                    <ListItem.Title>{item.productName} Qty: {item.adjustment}</ListItem.Title>
                    <ListItem.Subtitle>Unit: {item.baseUnit}</ListItem.Subtitle>
                   </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
            );
          }}
        />
            </View>
        </View>
    );
}

InventoryDetailScreen.navigationOptions = ({ navigation }) => {
    return {
        header: () => false
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0D93B3"
    },
    header_text: {
        fontSize: 25,
        color: "white",
        fontWeight: "bold",
        borderWidth: 3,
        marginLeft: 30,
        flexWrap:'wrap',
        flex:1,
        borderColor: "#0D93B3"
    },
    header: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    footer: {
        flex: 4,
        backgroundColor: "white",
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    title: {
        color: "#05375a",
        fontWeight: "bold",
        fontSize: 40
    },
    text: {
        color: "gray",
        fontSize: 20,
        fontWeight: 'bold',
    },
    textAgain: {
        color: "gray",
        fontSize: 18,
        marginLeft: 10,
        flex:1,
        flexWrap:'wrap'
    },
    button: {
        alignItems: "flex-end",
        marginTop: 15
    },
    button2: {
        borderRadius: 100
    },
    viewText: {
        flexDirection: 'row',
        marginTop: 15,
    }
});

export default InventoryDetailScreen;