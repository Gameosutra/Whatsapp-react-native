import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaView, NavigationEvents } from 'react-navigation';
import {
    View,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    TextInput
} from "react-native";
import { ListItem, Avatar, SearchBar } from "react-native-elements";
import * as Contacts from 'expo-contacts';
import _ from "lodash";
import { Context as PartyContext } from '../../context/PartyContext';

const AddContactsScreen = ({ navigation }) => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [arrayHolder, setArrayHolder] = useState([]);
    const [query, setQuery] = useState('');

    const { state, addContactToRS } = useContext(PartyContext);

    const addContacts = () => {
        setLoading(true);
        (async () => {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === 'granted') {
                const { data } = await Contacts.getContactsAsync({
                    fields: [
                        Contacts.PHONE_NUMBERS,
                        Contacts.EMAILS,
                    ],
                });

                if (data.length > 0) {
                    const contact = data;
                    setContacts(contact);
                    setArrayHolder(contact);
                    setLoading(false);
                }
            }
        })();
    }

    const searchFilterFunction = text => {   
        const sampleData = _.filter(arrayHolder, item => {
            return item.firstName?item.firstName.includes(text):null;
          });
          setContacts(sampleData);
      };

    return (
        <View forceInset={{ top: 'always' }}>
            <NavigationEvents
                onWillFocus={() => {
                    addContacts();
                }}
            />
            <SearchBar
                placeholder="Search Contact.."
                lightTheme
                
                value={query}
                onChangeText={text => {
                    setQuery(text)
                    searchFilterFunction(text)
                }}
                autoCorrect={false}
            />
            <FlatList
                data={contacts}
                keyExtractor={item => item.id}
                renderItem={({ item }) => {
                    return (
                        <TouchableOpacity
                            onPress={() => {
                                addContactToRS(item)
                            }}
                        >
                            <ListItem bottomDivider>
                                <Avatar style={styles.avtar} title="A"/>
                                <ListItem.Content>
                                    <ListItem.Title>{item.firstName}</ListItem.Title>
                                    <ListItem.Subtitle>{item.lastName}</ListItem.Subtitle>
                                </ListItem.Content>
                                <ListItem.Chevron />
                            </ListItem>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
}

AddContactsScreen.navigationOptions = () => {
    return {
        header: () => false,
    };
};

const styles = StyleSheet.create({
    avtar: {
        height: 30,
        width: 30,
        backgroundColor: "gray",
        borderRadius: 20
    },
    textInput: {
        padding: 15,
        color: "#05375a",
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 2
    },
});

export default AddContactsScreen;