import React, { useContext, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import { Text, Avatar, ListItem } from "react-native-elements";
import { Searchbar } from 'react-native-paper'
import { SafeAreaView, NavigationEvents } from "react-navigation";
import { Feather, AntDesign } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import moment from 'moment';

import { Context as InventoryContext } from "../../context/InventoryContext";

const InventoryListScreen = ({ navigation, route }) => {
  const {
    state,
    fetchInventoryLogs,
    clearData
  } = useContext(InventoryContext);
  console.log(route, 'Route')
  const [search, setSearchQuery] = useState('');
  
  const fetchSearchedInvLogs = search => {
    setSearchQuery(search);
    fetchInventoryLogs([],search, 20 ,0,  route.params.type)
  }
  const onRefresh = () => {
    fetchInventoryLogs([], search, 20, 0, route.params.type);
  };

  return (
    <View style={styles.container}>
      <Animatable.View
        duration={600}
        animation="fadeInDown"
        style={styles.header}
      >
        <Text style={styles.text_header}>{route.params.type}</Text>
        <Avatar style={styles.avtar} title={<Feather name="plus" size={30} />} onPress={() => {
            navigation.navigate("InventoryCreate", {type: route.params.type});
          }} />
      </Animatable.View>
      <Searchbar
            placeholder="Search Here..."
            onChangeText={fetchSearchedInvLogs}
            value={search}
        />
    <View style={styles.footer}>
        <NavigationEvents
          onWillFocus={() => {
            fetchInventoryLogs([], '', 20, 0, route.params.type);
          }}
          onWillBlur={() => {
            clearData();
          }}
        />
        {state.inventoryLoader ? (
          <View>
            <ActivityIndicator size="large" style={{ marginTop: 200 }} />
          </View>
        ) : null}
        <FlatList
          data={state.inventoryLogs}
          keyExtractor={item => item._id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                key={item._id}
                 onPress={() => {
                  navigation.navigate("InventoryDetails", { _id: item._id, reason: route.params.type });
                 }}
              >
                <ListItem bottomDivider>
                  <Avatar style={styles.avtar} title="IA" />
                  <ListItem.Content>
                    <ListItem.Title>{item._id}</ListItem.Title>
                    <ListItem.Subtitle>Items: {item.count}</ListItem.Subtitle>
                    <ListItem.Subtitle>Date: {item.usageDate}</ListItem.Subtitle>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
              </TouchableOpacity>
            );
          }}
          onEndReachedThreshold={1}
          onEndReached={ () => fetchInventoryLogs.apply(state,[state.inventoryLogs, undefined, 20,state.offset, route.params.type])}
          ListFooterComponent = { state.bottomLoader ? <ActivityIndicator color="#0000ff" animating size="large" />: null}
          refreshControl={
            <RefreshControl
              refreshing={state.inventoryLoader}
              onRefresh={onRefresh}
            />
          }
        />
      </View>
    </View>
  );
};

InventoryListScreen.navigationOptions = () => {
  return {
    header: () => false
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D93B3"
  },
  header: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 20
  },
  footer: {
    flex: 8,
    backgroundColor: "white",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 30
  },
  text_header: {
    color: "white",
    fontSize: "bold",
    fontSize: 30
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18
  },
  action: {
    marginTop: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 5,
    flexDirection: "row"
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
    color: "#05375a"
  },
  button: {
    marginTop: 30
  },
  error: {
    fontSize: 15,
    color: "red",
    marginTop: 20
  },
  avtar: {
    height: 50,
    width: 50,
    marginRight: 10,
    backgroundColor: "#05375a",
    borderRadius: 30
  },
});

export default InventoryListScreen;
