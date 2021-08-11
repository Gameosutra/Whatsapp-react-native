import React, { useContext, useEffect, useState, } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Text,
  RefreshControl
} from "react-native";
import { NavigationEvents } from "react-navigation";
import { ListItem, Avatar, SearchBar } from "react-native-elements";
import { Entypo, Feather } from '@expo/vector-icons'; 
import { Context as PartyContext } from "../../context/PartyContext";
import Icon from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');
const colors = {
  french_blue: '#3f51b5',
  deep_sky_blue: '#007aff',
  white: '#ffffff',
  black: '#000000',
  veryLightPink: '#f2f2f2'
};

const PartyScreen =  ({navigation})  => {
  const { state, fetchParties, offset ,clearData } = useContext(PartyContext);
  const [search, setSearchQuery] = useState('');
  
  useEffect(() => {
    onRefresh();
  },[])

  const fetchSearchedParties = search => {
    setSearchQuery(search);
    fetchParties([],search, 15 ,0)
  }
  const onRefresh = () => {
    //setRefreshing(true);
    fetchParties([], search, 15, 0);
  };
  if (state.loader) {
    return (
      
      <View>
      <SearchBar
        placeholder="Search Party Here..."
        onChangeText={fetchSearchedParties}
        value={search}
      />
      <ActivityIndicator style={{
        position: 'relative',
        width: width,
        height: height,
        paddingVertical: 20,
        borderTopWidth: 1,
        marginTop: 20,
        marginBottom: 10,
        borderColor: colors.veryLightPink
      }} color="#0000ff" animating size="large" />
    </View>
    );
  } else {
  return (
    <View>
      <SearchBar
        placeholder="Search Party Here..."
        onChangeText={fetchSearchedParties}
        value={search}
        containerStyle={{
          backgroundColor: "white",
        }}
        inputContainerStyle={{
          backgroundColor: "white"
        }}
        lightTheme
      />
      <NavigationEvents
        onWillFocus={() => {
          fetchParties([],undefined, 15,0)
        }}
        onWillBlur={clearData}
      />
      <FlatList
        style={styles.list}
        data={state.parties}
        keyExtractor={item => item._id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              key={item._id}
              onPress={() => {
                navigation.navigate("PartyDetail", { _id: item._id });
              }}
            >
              <ListItem bottomDivider>
                <Avatar style={styles.avtar} title={item.businessName[0]}/>
                <ListItem.Content>
                  <ListItem.Title>{item.businessName}</ListItem.Title>
                  <ListItem.Subtitle>{item.phone}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            </TouchableOpacity>
          );
        }}
        onEndReachedThreshold={0.4}
        onEndReached={ () => fetchParties.apply(state,[state.parties, undefined, 15,state.offset])}
        ListFooterComponent = { state.bottomLoader ? <ActivityIndicator color="#0000ff" animating size="large" />: null}
        refreshControl={
          <RefreshControl
            refreshing={state.loader}
            onRefresh={onRefresh}
          />
        }
      />
      <TouchableOpacity onPress={() => {navigation.navigate('AddContacts')}}
                style={{
                    borderWidth:1,
                    borderColor:'rgba(0,0,0,0.2)',
                    alignItems:'center',
                    justifyContent:'center',
                    width:70,
                    position: 'absolute',                                          
                    bottom: 90,                                                    
                    right: 20,
                    height:70,
                    backgroundColor:'#0D93B3',
                    borderRadius:100,
                }}
              >
                <Icon name="add"  size={50} color="#fff" />
            </TouchableOpacity>
          </View>
    )
      }
}

PartyScreen.navigationOptions = ({ navigation }) => {
    return {
    headerTitle: 'Parties',
    headerTitleStyle: {
      alignSelf:'center'
    },
    tabBarIcon: <Entypo name="book" size={20} />
    };
  };

const styles = StyleSheet.create({
    avtar: {
      height: 30,
      width: 30,
      backgroundColor: "gray",
      borderRadius: 20
    },
    list: {
      height: "100%",
    }
});

export default PartyScreen;