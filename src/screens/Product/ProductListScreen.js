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
import { ListItem, Avatar, BottomSheet, CheckBox, Button } from "react-native-elements";
import RBSheet from "react-native-raw-bottom-sheet";
import { Feather, AntDesign } from "@expo/vector-icons";

import { Context as ProductContext } from "../../context/ProductContext";
import SearchComp from '../../components/searchBarComponent'

import { ScrollView } from "react-native-gesture-handler";

const { width, height } = Dimensions.get('window');

const colors = {
  french_blue: '#3f51b5',
  deep_sky_blue: '#007aff',
  white: '#ffffff',
  black: '#000000',
  veryLightPink: '#f2f2f2'
};

const ProductListScreen = ({navigation}) => {
  const { state, 
          setBottomSheet, 
          fetchProducts, 
          fetchProductsFilters,
          setFilters,
          clearData
        }   = useContext(ProductContext);
    const refRBSheet = useRef();

  const [searchFilter, setSearchFilter] = useState("");
  useEffect(() => {
    navigation.setParams({
      handleBottomSheet: (variable) => {
        // setBottomSheet(true);
        refRBSheet.current.open()

      },
      isVisible: state.isVisible
    });
  }, [])

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
        onWillFocus={() => {
          fetchProductsFilters();
          fetchProducts({
            products: [],
            offset: 0,
            limit: 10,
          })
        }}
        onWillBlur={clearData}
      />
      <SearchComp getSearch={(searchFilter) => {
          setSearchFilter(searchFilter);
            fetchProducts({
              searchFilter,
              products: [],
              offset: 0,
              limit: 10,
            });
      }} />
      <FlatList
        style={styles.list}
        data={state.products}
        keyExtractor={item => item._id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              key={item._id}
              onPress={() => {
                navigation.navigate("ProductDetail", { _id: item._id });
              }}
            >
              <ListItem bottomDivider>
                <Avatar style={styles.avtar} title={item.name[0]} />
                <ListItem.Content>
                  <ListItem.Title>{item.name}</ListItem.Title>
                  <ListItem.Subtitle>{item.category}</ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={_renderFooter()}
        onRefresh={() => {
          fetchProducts({
            products: [],
            offset: 0,
            limit: 10,
            brandFilter: [],
            categoryFilter: [],
            refreshing: true
          })
        }}
        refreshing={state.refreshing}
        onEndReached={() => {
          fetchProducts({
            searchFilter,
            products: state.products,
            loadMore: (state.products.length < state.total) ? true : false,
            offset: state.offset*1+state.limit*1,
            limit: 10,
            brandFilter: state.brandFilter,
            categoryFilter: state.categoryFilter,
          })
        }}
        onEndReachedThreshold={0}
        initialNumToRender={10}
      />
      <TouchableOpacity style={styles.floatingActionEdit} 
        onPress={() => {
          refRBSheet.current.open();
        }}
        >
          <AntDesign name="filter" size={20} color="white" />
        </TouchableOpacity>
       <TouchableOpacity style={styles.floatingAction} 
        onPress={() => {
          navigation.navigate("ProductCreate")
        }}
        >
          <Feather name='plus' size={30} color='white' />
        </TouchableOpacity>
        <RBSheet
        ref={refRBSheet}
        dragFromTopOnly
        closeOnDragDown
        height={500}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0.5, 0.25, 0, 0.2)"
          },
          draggableIcon: {
            backgroundColor: "#000"
          }
        }}
      >
        <ScrollView stickyHeaderIndices={[0]}>
          <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <View style={{flex: 1}}>
            <Button
              title="Apply"
              buttonStyle={{backgroundColor: "#0D93B3", marginBottom: "3%"}}
              onPress={() => { 
                fetchProducts({
                  products: [],
                  offset: 0,
                  limit: 10,
                  brandFilter: state.brandFilter,
                  categoryFilter: state.categoryFilter,
                }) 
                refRBSheet.current.close();
            }}
            />
            </View>
            <View style={{flex: 1}}>
            <Button
              title="Clear All"
              buttonStyle={{backgroundColor: "#0D93B3", marginTop: "1%"}}
              onPress={() => {
                fetchProducts({
                  products: [],
                  offset: 0,
                  limit: 10,
                  brandFilter: [],
                  categoryFilter: [],
                })
                refRBSheet.current.close();
              }}
            />
            </View>
            
            
          </View>

            {state.filters && state.filters.brand && state.filters.brand.map((l, i) => (
              <ListItem key={l}>
                <ListItem.Content>
                  {/* <ListItem.Title></ListItem.Title> */}
                  <CheckBox
                    title={l}
                    checked={state.brandFilter && state.brandFilter.includes(l)}
                    onPress={() => {
                      setFilters({
                        type: "brand",
                        filter: state.brandFilter,
                        item: l
                      })
                    }}
                    containerStyle={{ width: "100%" }}
                  />
                </ListItem.Content>
              </ListItem>
            ))}
            {state.filters && state.filters.categories && state.filters.categories.map((l, i) => (
              <ListItem key={i}>
                <ListItem.Content>
                  <CheckBox
                    title={l}
                    checked={state.categoryFilter && state.categoryFilter.includes(l)}
                    onPress={() => {
                      setFilters({
                        type: "category",
                        filter: state.categoryFilter,
                        item: l
                      })
                    }}
                    containerStyle={{ width: "100%" }}
                  />
                </ListItem.Content>
              </ListItem>
            ))}
          </ScrollView>
      </RBSheet>
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

ProductListScreen.navigationOptions = ({ navigation }) => {
  const { params = {} } = navigation.state;
  return {
    headerTitle: 'Products',
    headerRight: () => (
      <View style={{
        display: "flex",
        flexDirection: "row"
      }}>
        <TouchableOpacity >
          <AntDesign onPress={() => { params.handleBottomSheet(!params.isVisible) }} name="filter" size={25} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {
          navigation.navigate('ProductCreate')
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
  },
  floatingActionEdit: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 45,
    position: 'absolute',
    bottom: 100,
    right: 30,
    height: 45,
    backgroundColor: 'gray',
    borderRadius: 100,
  }
});

export default ProductListScreen;


