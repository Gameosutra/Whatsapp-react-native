import React, { useContext, useState, useEffect, useRef } from "react";
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
    FlatList,
    Dimensions,
} from "react-native";
import { ListItem, Avatar, Button, Overlay } from "react-native-elements";
import { NavigationEvents } from "react-navigation";
import { AntDesign } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import RBSheet from "react-native-raw-bottom-sheet";
import Autocomplete from "react-native-autocomplete-input";
import moment from 'moment';

import SearchComp from '../../components/searchBarComponent'
import { Context as InvoiceContext } from "../../context/InvoiceContext";
import { Context as ProductContext } from "../../context/ProductContext";
import { Context as AuthContext } from "../../context/AuthContext";

const { width, height } = Dimensions.get('window');

const colors = {
    french_blue: '#3f51b5',
    deep_sky_blue: '#007aff',
    white: '#ffffff',
    black: '#000000',
    veryLightPink: '#f2f2f2'
};

const InvoiceCreateScreen = ({ navigation,route }) => {

    const { state,
        fetchProducts,
        adjustListAfterAddition,
        clearData
    } = useContext(ProductContext);
    const { state: {
        addedProducts,
        addedProductsHash,
        productsTaxAmount,
        productsDiscountAmount,
        subTotalAmount,
        totalAmount,
        discountOnInvoice,
        loader,
        parties,
        selectedInvoiceDetails,
    },
        addProductsInInvoice,
        createInvoice,
        fetchParties,
        updateInvoiceById,
        clearDataForSelectedInvoice,
    } = useContext(InvoiceContext);
    const { state: { user } } = useContext(AuthContext);
    const refRBSheet = useRef();
    const [searchFilter, setSearchFilter] = useState("");
    const [textValue, setTextValue] = useState(0);
    const [isOverlay, setIsOverlay] = useState(false);
    const [seller, setSeller] = useState(selectedInvoiceDetails._id?selectedInvoiceDetails.seller:{});

    useEffect(() => {
        fetchParties();
        fetchProducts({
            products: [],
            offset: 0,
            limit: 10,
            addedProductsHash: selectedInvoiceDetails._id ? addedProductsHash : [],
        })
    }, [])

    useEffect(() => {
        navigation.setParams({
            handleBottomSheet: () => {
                refRBSheet.current.open()
            },
            length: addedProducts.length,
            selectedInvoiceDetails: selectedInvoiceDetails._id?selectedInvoiceDetails._id:undefined
        });
    }, [addedProducts.length])

    useEffect(() => {
        return () => {
            clearData();
            clearDataForSelectedInvoice();
        }
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
                                            quantity: textValue * 1,
                                            price: item.purchasingPrice,
                                            discount: item.discount ? item.discount : 0,
                                            tax: item.tax ? item.tax : 0,
                                        }
                                        addProductsInInvoice({
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
                        loadMore: (state.products.length < (state.total - addedProducts.length)) ? true : false,
                        offset: state.offset * 1 + state.limit * 1,
                        limit: 10,
                        brandFilter: state.brandFilter,
                        categoryFilter: state.categoryFilter,
                    })
                }}
                onEndReachedThreshold={0}
                initialNumToRender={10}
                removeClippedSubviews={false}
            />
            <TouchableOpacity style={styles.floatingAction} 
                onPress={() => {
                    refRBSheet.current.open()
                }}
                >
                <Text style={{color: "#fff"}}>{addedProducts.length}</Text>
                </TouchableOpacity>
            <RBSheet
                ref={refRBSheet}
                dragFromTopOnly
                closeOnDragDown
                height={800}
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
                        {!route.params.isPos 
                            && <Button
                            title={seller && seller.businessName?`Selected Seller: ${seller.businessName}` : 'Select Seller'}
                            onPress={() => {
                                setIsOverlay(true);
                            }}
                            disabled={selectedInvoiceDetails._id}
                        />
                        }
                        <Overlay 
                            isVisible={isOverlay} 
                            onBackdropPress={() => { setIsOverlay(false) }}
                            overlayStyle={{width:"70%",height:"70%"}}
                        >
                            <FlatList
                                style={styles.list}
                                data={parties}
                                keyExtractor={item => item._id}
                                renderItem={({ item }) => {
                                    return (
                                        <TouchableOpacity
                                            key={item._id}
                                            onPress={() => {
                                                setSeller(item);
                                                setIsOverlay(false)
                                            }}
                                        >
                                            <ListItem bottomDivider>
                                                <Avatar style={styles.avtar} title={item.businessName[0]} />
                                                <ListItem.Content>
                                                    <ListItem.Title>{item.businessName}</ListItem.Title>
                                                </ListItem.Content>
                                            </ListItem>
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                        </Overlay>
                        <Text>SubTotal: {subTotalAmount.toFixed(2)}</Text>
                        <Text>Sub Tax: {productsTaxAmount.toFixed(2)}</Text>
                        <Text>Sub Discount: {productsDiscountAmount.toFixed(2)}</Text>
                        <Text>Total: {totalAmount.toFixed(2)}</Text>
                        <Button
                            title={selectedInvoiceDetails._id?'Update':'Create'}
                            onPress={() => {
                                let payload = {
                                    buyer: user.business._id,
                                    description: "Hi",
                                    discountOnInvoice,
                                    items: addedProducts,
                                    ...(route.params.isPos ) && {
                                        seller: route.params.isPos,
                                        isPos: true,
                                        concernedPerson:"Harshit The Customer",
                                        concernedPersonNumber:"7838902470",
                                    },
                                    ...(!route.params.isPos) && {
                                        seller: seller._id,
                                    },
                                    ...(selectedInvoiceDetails._id) && {
                                        _id: selectedInvoiceDetails._id
                                    }
                                }
                                if(selectedInvoiceDetails._id) {
                                    updateInvoiceById(payload,navigation)
                                } else {
                                    createInvoice(payload,navigation)
                                }
                                
                            }}
                            loading={loader}
                            disabled={(addedProducts.length === 0 || ( !route.params.isPos && (!seller || seller && !seller._id))) }
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
                                value={`${item.quantity}`}
                                onChangeText={(text) => {
                                    let tempProduct = {
                                        ...item,
                                        product: item._id,
                                        quantity: text * 1,
                                    }
                                    addProductsInInvoice({
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
                                addProductsInInvoice({
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

InvoiceCreateScreen.navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
        headerTitle: `${params.selectedInvoiceDetails ? "Update" : "Create"}`,
        headerRight: () => (
            <View style={{
                display: "flex",
                flexDirection: "row"
            }}>
                <TouchableOpacity >
                    <AntDesign onPress={() => { params.handleBottomSheet() }} name="filter" size={25} />
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

export default InvoiceCreateScreen;
