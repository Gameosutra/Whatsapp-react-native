import React, { useEffect, useContext, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from "react-native";
import { NavigationEvents } from "react-navigation";
import { ListItem, Avatar } from "react-native-elements";
import { Feather } from "@expo/vector-icons";

import { Context as InvoiceContext } from "../../context/InvoiceContext";
import SearchComp from '../../components/searchBarComponent'


const { width, height } = Dimensions.get('window');

const colors = {
  french_blue: '#3f51b5',
  deep_sky_blue: '#007aff',
  white: '#ffffff',
  black: '#000000',
  veryLightPink: '#f2f2f2'
};

const InvoiceListScreen = ({navigation}) => {
  const { state,
        fetchInvoices, 
          clearDataOfInvoiceList
        }   = useContext(InvoiceContext);
  useEffect(() => {
    fetchInvoices({
      invoices: [],
      offset: 0,
      limit: 10,
      ...(navigation.state && navigation.state.params && navigation.state.params.isPos) && {
        seller: navigation.state.params.isPos
      }
    })
  }, [])
  const [searchFilter, setSearchFilter] = useState("");

  const _renderFooter = () => {
      if (!state.loadingMore) return null;
  
      return (
        <View
          style={{
            position: 'relative',
            width: width,
            height: height,
            paddingVertical: 20,
            borderTopWidth: 1,
            marginTop: 10,
            marginBottom: 10,
            borderColor: colors.veryLightPink
          }}
        >
          <ActivityIndicator color="#0000ff" animating size="large" />
        </View>
      );
    };

  return !state.loading ? (
    <View>
      <NavigationEvents
        onWillBlur={clearDataOfInvoiceList}
      />
      <SearchComp getSearch={(searchFilter) => {
          setSearchFilter(searchFilter);
            fetchInvoices({
              searchFilter,
              invoices: [],
              offset: 0,
              limit: 10,
              ...(navigation.state && navigation.state.params && navigation.state.params.isPos) && {
                seller: navigation.state.params.isPos
              }
            });
      }} />
      <FlatList
        style={styles.list}
        data={state.invoices}
        keyExtractor={item => item._id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              key={item._id}
              onPress={() => {
                navigation.navigate("InvoiceDetail",{ _id: item._id, isPos: (navigation.state && navigation.state.params && navigation.state.params.isPos)?navigation.state.params.isPos:false })
              }}
            >
              <ListItem bottomDivider>
                <Avatar style={styles.avtar} title={item.invoiceNo[0]} />
                <ListItem.Content>
                  <ListItem.Title>{item.invoiceNo} (Total Amount: {item.total.toFixed(2)})</ListItem.Title>
                  <ListItem.Subtitle>{`Total Products: `+item.items.length}</ListItem.Subtitle>
                  <ListItem.Subtitle>Receive Status: {item.confirmReceiving?`Received`:`Not Yet`}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={_renderFooter()}
        onRefresh={() => {
          fetchInvoices({
            invoices: [],
            offset: 0,
            limit: 10,
            refreshing: true,
            ...(navigation.state && navigation.state.params && navigation.state.params.isPos) && {
              seller: navigation.state.params.isPos
            }
          })
        }}
        refreshing={state.refreshing}
        onEndReached={() => {
          fetchInvoices({
            searchFilter,
            invoices: state.invoices,
            loadMore: (state.invoices.length < state.total) ? true : false,
            offset: state.offset*1+state.limit*1,
            limit: 10,
            ...(navigation.state && navigation.state.params && navigation.state.params.isPos) && {
              seller: navigation.state.params.isPos
            }
          })
        }}
        onEndReachedThreshold={0.1}
        initialNumToRender={10}
      />
       <TouchableOpacity style={styles.floatingAction} 
                onPress={() => {
                  navigation.navigate("InvoiceCreate",{isPos: false})
                }}
                >
                <Feather name='plus' size={30} color='white' />
                </TouchableOpacity>

    </View>
  )
    : (
      <View
        style={{
          position: 'relative',
          width: width,
          height: height,
          paddingVertical: 20,
          borderTopWidth: 1,
          marginTop: 10,
          marginBottom: 10,
          borderColor: colors.veryLightPink
        }}
      >
        <ActivityIndicator color="#0000ff" animating size="large" />
      </View>
    );
}

InvoiceListScreen.navigationOptions = ({ navigation }) => {
  return {
    headerTitle: `${navigation.state && navigation.state.params && navigation.state.params.isPos?"POS List":"Invoice List"}`,
    headerRight: () => (
      <View style={{
        display: "flex",
        flexDirection: "row"
      }}>
        <TouchableOpacity onPress={() => {
          navigation.navigate('InvoiceCreate', {
            ...(navigation.state && navigation.state.params && navigation.state.params.isPos) && {
              isPos: navigation.state.params.isPos
            }
          })
        }}>
          <Feather name="plus" size={30} />
        </TouchableOpacity>
      </View>
    ),
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
    height: "93.5%",
  },
  floatingAction: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 63,
    position: 'absolute',
    bottom: 20,
    right: 20,
    height: 63,
    backgroundColor: '#0D93B3',
    borderRadius: 100,
  }
});

export default InvoiceListScreen;


