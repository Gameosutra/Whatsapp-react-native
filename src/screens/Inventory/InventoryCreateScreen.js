import React, { useContext, useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Dimensions
} from "react-native";
import { ListItem, Avatar, Button } from "react-native-elements";
import { NavigationEvents } from "react-navigation";
import { AntDesign } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import RBSheet from "react-native-raw-bottom-sheet";


import SearchComp from '../../components/searchBarComponent'
import { Context as InventoryContext } from "../../context/InventoryContext";
import { Context as ProductContext } from "../../context/ProductContext";

const { width, height } = Dimensions.get('window');

const colors = {
  french_blue: '#3f51b5',
  deep_sky_blue: '#007aff',
  white: '#ffffff',
  black: '#000000',
  veryLightPink: '#f2f2f2'
};

const InventoryCreateScreen = ({navigation}) => {
  const { state, 
          fetchProducts, 
          fetchProductsFilters,
          adjustListAfterAddition,
          clearData
        }   = useContext(ProductContext);
  const { state: { isVisible, addedProducts, addedProductsHash }, 
          addProductsInInventory, 
          adjustInventory, 
          createInventoryClearData
    }   = useContext(InventoryContext);
    const refRBSheet = useRef();
  const [searchFilter, setSearchFilter] = useState("");
  const [textValue, setTextValue] = useState(0);
  
  useEffect(() => {
    navigation.setParams({
      handleBottomSheet: () => {
        refRBSheet.current.open()
      },
      isVisible,
      length: addedProducts.length
    });
  }, [addedProducts.length])

  const typeOfIntventory = (type) => {
    switch(type) {
      case "Inventory Audit":
        return "inventory-audit";
      case "New Consignment":
        return "new-consignment";
      case "Wastage Inventory":
        return "wastage";
      case "Sales":
        return "sales"
    }
  }

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
            addedProductsHash: [],
          })
        }}
        onWillBlur={() => {createInventoryClearData();clearData();}}
      />
      <SearchComp getSearch={(searchFilter) => {
          setSearchFilter(searchFilter);
            fetchProducts({
              searchFilter,
              products: [],
              offset: 0,
              limit: 10,
              addedProductsHash
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
            >
              <ListItem bottomDivider>
                <Avatar style={styles.avtar} title={item.name[0]} />
                <ListItem.Content>
                  <ListItem.Title>{item.name}</ListItem.Title>
                  <ListItem.Subtitle>{item.category}</ListItem.Subtitle>
                </ListItem.Content>
                <TextInput
                      placeholder="Enter Qt."
                      style={styles.textInput}
                      keyboardType="numeric"
                      // value={`${purchasingPrice}`}
                      onChangeText={setTextValue}
                      onSubmitEditing={() => {
                        let tempProduct = {
                          ...item,
                          product: item._id,
                          currentStock: item.inventory.currentStock,
                          adjustment: textValue*1,
                          price: item.purchasingPrice,
                        }
                        addProductsInInventory({
                          addedProducts,
                          isAdd: true,
                          product: tempProduct
                        }, () => {
                          adjustListAfterAddition({
                            product: tempProduct,
                            isAdd: true,
                            products: state.products
                          });
                          setTextValue(0);
                        })
                      }}
                    />
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
            refreshing: true,
            addedProductsHash
          })
        }}
        refreshing={state.refreshing}
        onEndReached={() => {
          fetchProducts({
            searchFilter,
            products: state.products,
            loadMore: (state.products.length < (state.total-addedProducts.length)) ? true : false,
            offset: state.offset*1+state.limit*1,
            limit: 10,
            brandFilter: state.brandFilter,
            categoryFilter: state.categoryFilter,
          })
        }}
        onEndReachedThreshold={0}
        initialNumToRender={10}
        removeClippedSubviews={false}
      />
        <RBSheet
        ref={refRBSheet}
        dragFromTopOnly
        closeOnDragDown
        height={600}
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
        <View>
            <Button
              title="Adjust Inventory"
              onPress={() => { 
                adjustInventory({
                  reason: typeOfIntventory(navigation.state.params.type),
                  type: navigation.state.params.type,
                  addedProducts
                })
               }}
               disabled={addedProducts.length === 0}
            />
          </View>
            {addedProducts && addedProducts.map((item) => (
              <ListItem bottomDivider key={item._id}>
                <Avatar style={styles.avtar} title={item.name[0]} />
                <ListItem.Content>
                  <ListItem.Title>{item.name}</ListItem.Title>
                  <ListItem.Subtitle>{item.category}</ListItem.Subtitle>
                </ListItem.Content>
                <TextInput
                      placeholder="Enter Qt."
                      style={styles.textInput}
                      keyboardType="numeric"
                      value={`${item.adjustment}`}
                      onChangeText={(text) => {
                        let tempProduct = {
                          ...item,
                          product: item._id,
                          currentStock: item.inventory.currentStock,
                          adjustment: text*1,
                          price: item.purchasingPrice,
                        }
                        addProductsInInventory({
                          addedProducts,
                          isAdd: true,
                          product: tempProduct
                        }, () => {
                          adjustListAfterAddition({
                            product: tempProduct,
                            isAdd: true,
                            products: state.products
                          });
                        })
                      }}
                    />
            <AntDesign onPress={() => { 
              addProductsInInventory({
                addedProducts,
                isAdd: false,
                product: item
              }, () => {
                adjustListAfterAddition({
                  product: item,
                  isAdd: false,
                  products: state.products
                });
              })
             }} name="delete" size={25} color="red" />
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

InventoryCreateScreen.navigationOptions = ({ navigation }) => {
  const { params = {} } = navigation.state;
  return {
    headerTitle: `Create ${params.type}`,
    headerRight: () => (
      <View style={{
        display: "flex",
        flexDirection: "row"
      }}>
        <TouchableOpacity >
          <AntDesign onPress={() => { params.handleBottomSheet(!params.isVisible) }} name="filter" size={25} />
        </TouchableOpacity>
        <View><Text>({params.length})</Text></View>
      </View>
    ),
  };
};

const styles = StyleSheet.create({
  list: {
    height: "93.5%",
  },
  avtar: {
    height: 30,
    width: 30,
    backgroundColor: "gray",
    borderRadius: 20
  },
  textInput: {
    paddingRight: 20,
    color: "#05375a",
  },
  error: {
    fontSize: 15,
    color: "red",
    marginTop: 20
  }
});

export default InventoryCreateScreen;
