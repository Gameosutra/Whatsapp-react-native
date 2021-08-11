import React, { useState, useRef, useContext, useEffect } from "react";
import { Button, Text, Avatar, ListItem, Overlay } from "react-native-elements";
import {
  View,
  StyleSheet,
  ScrollView,
  Picker,
  TextInput,
  FlatList,
  TouchableOpacity,
  Dimensions
} from "react-native";
import { Dropdown } from 'react-native-material-dropdown-v2';
import SlidingScreen from '../screens/SlidingScreen/SlidingScreen';
import RBSheet from "react-native-raw-bottom-sheet";
import { taxValues } from '../constants/hardCodedvalues';
import { Context as ProductContext } from '../context/ProductContext';

const { width, height } = Dimensions.get('window');


const ProductForm = ({
  product,
  onSubmit,
  onSubmitButton,
  title,
  error,
  loader
}) => {
  const { state, fetchCategories, fetchUnits, createCategory} = useContext(ProductContext);

  useEffect(() => {
    fetchUnits();
    fetchCategories();
  },[])

  const refRBSheet = useRef();
  const refRBSheetUnit = useRef();

  const [nameCat, setNameCat] = useState("");
  const [selectedUnit, setSelectedUnit] = useState("");
  const [isCreateNew, setIsCreateNew] = useState(false);
  const [isUnitSelection, setIsUnitSelection] = useState(false);
  const [isSecondary, setIsSecondary] = useState(false);

  const [name, setName] = useState(product.name);
  const [skuCode, setSkuCode] = useState(product.skuCode);
  const [category, setCategory] = useState(product.category);
  const [primaryUnit, setPrimaryUnit] = useState(product.baseUnit);
  const [secondaryUnit, setSecondaryUnit] = useState(product.baseUnit);
  const [brand, setBrand] = useState(product.brand);
  const [purchasingPrice, setPurchasingPrice] = useState(product.purchasingPrice);
  const [sellingPrice, setSellingPrice] = useState(product.sellingPrice);
  // const [unitConversion, setUnitConversion] = useState(product.unitConversion);
  const [tax, setTax] = useState(product.tax);
  const [discount, setDiscount] = useState(product.discount);
  const [parLevel, setParLevel] = useState(product.parLevel);
  const [description, setDescription] = useState(product.description);
  const [shelf, setShelf] = useState(product.shelf);
  const [currentStock, setCurrentStock] = useState(product.inventory.currentStock);

  const firstComponent = () => {
    return (
      <View >
        <Text
          style={styles.text_footer}
        >
          Selling Price
          </Text>
        <View style={styles.action}>
          <TextInput
            placeholder="Enter Selling Price"
            style={styles.textInput}
            keyboardType="numeric"
            value={`${sellingPrice}`}
            onChangeText={setSellingPrice}
          />
        </View>
        <Text
          style={[
            styles.text_footer,
            {
              marginTop: 35
            }
          ]}
        >
          Purchasing Price
          </Text>
        <View style={styles.action}>
          <TextInput
            placeholder="Enter Purchasing Price"
            style={styles.textInput}
            keyboardType="numeric"
            value={`${purchasingPrice}`}
            onChangeText={setPurchasingPrice}
          />
        </View>
        <Text
          style={[
            styles.text_footer,
          ]}
        >
          Tax
          </Text>
        <View style={styles.action}>
          <Dropdown
            label='Select Tax'
            data={taxValues}
            onChangeText={(args, index, data) => {
              
              setTax(data[index+1].tax);
            } }
            containerStyle={{width: "100%"}}
          />
        </View>
        <Text
          style={[
            styles.text_footer,
            {
              marginTop: 35
            }
          ]}
        >
          Discount
          </Text>
        <View style={styles.action}>
          <TextInput
            placeholder="Enter Discount"
            style={styles.textInput}
            keyboardType="numeric"
            value={`${discount}`}
            onChangeText={setDiscount}
          />
        </View>
      </View>
    )
  }

  const secondComponent = () => {
    return (
      <View >
        <Text
          style={styles.text_footer}
        >
          Brand Name
          </Text>
        <View style={styles.action}>
          <TextInput
            placeholder="Enter Brand Name"
            style={styles.textInput}
            autoCapitalize="none"
            autoCorrect={false}
            value={brand}
            onChangeText={setBrand}
          />
        </View>
        <Text
          style={[
            styles.text_footer,
            {
              marginTop: 35
            }
          ]}
        >
          Par Level
          </Text>
        <View style={styles.action}>
          <TextInput
            placeholder="Enter PAR Level"
            style={styles.textInput}
            keyboardType="numeric"
            value={`${parLevel}`}
            onChangeText={setParLevel}
          />
        </View>
        <Text
          style={[
            styles.text_footer,
            {
              marginTop: 35
            }
          ]}
        >
          Descryption
          </Text>
        <View style={styles.action}>
          <TextInput
            placeholder="Enter Descryption"
            style={styles.textInput}
            value={`${description}`}
            onChangeText={setDescription}
          />
        </View>
        <Text
          style={[
            styles.text_footer,
            {
              marginTop: 35
            }
          ]}
        >
          Shelf
          </Text>
        <View style={styles.action}>
          <TextInput
            placeholder="Enter Shelf Name"
            style={styles.textInput}
            value={`${shelf}`}
            onChangeText={setShelf}
          />
        </View>
        <Text
          style={[
            styles.text_footer,
            {
              marginTop: 35
            }
          ]}
        >
          Current Stock
          </Text>
        <View style={styles.action}>
          <TextInput
            placeholder="Enter Current Stock"
            style={styles.textInput}
            keyboardType="numeric"
            value={`${currentStock}`}
            onChangeText={setCurrentStock}
          />
        </View>
      </View>
    )
  }

  return (
    <View>
      <View style={styles.container}>
        <View style={{ padding: "4%" }}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.text_footer}>Product Name</Text>
              <View style={styles.action}>
                <TextInput
                  placeholder="Enter Product Name"
                  style={styles.textInput}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.text_footer}> Base Unit </Text>
                <Button
                  title={primaryUnit?primaryUnit:"Select Unit"}
                  onPress={() => {
                    if(!primaryUnit) setIsUnitSelection(true);
                    refRBSheetUnit.current.open()
                  }}
                  buttonStyle={{backgroundColor: "#0D93B3", width: "100%", marginTop: "1%"}}
                />
              </View>
          </View>
          <View style={{ flexDirection: "row", marginTop: "4%" }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.text_footer}> Product Sku Code</Text>
              <View style={styles.action}>
                <TextInput
                  placeholder="Enter Sku Name"
                  style={styles.textInput}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={skuCode}
                  onChangeText={setSkuCode}
                />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.text_footer}>Category</Text>
              <Button
                title={category?category:"Select Category"}
                onPress={() => {
                  refRBSheet.current.open();
                  setIsCreateNew(false);
                  if(category && state.productCategories.length) {
                    let categoryFind = state.productCategories.filter(item => item.name === category);
                    setNameCat(categoryFind[0]._id);
                  }
                }}
                buttonStyle={{backgroundColor: "#0D93B3",marginTop: "1%"}}

              />
            </View>
          </View>
        </View>
        <View style={{height: "66%", marginTop: "-2%"}}>
        <SlidingScreen
          firstComponentHeader="Basic Details"
          secondComponentHeader="Advance Details"
          firstComponent={firstComponent()}
          secondComponent={secondComponent()}
        />
        </View>
        <View style={styles.button}>
          <Button
            title={onSubmitButton}
            onPress={() => {
              onSubmit({
                name,
                skuCode,
                category,
                baseUnit: primaryUnit,
                secondaryUnit,
                brand,
                purchasingPrice,
                sellingPrice,
                unitConversion: product.unitConversion,
                tax,
                discount,
                parLevel,
                description,
                shelf,
                inventory: { currentStock: currentStock * 1 }
              });
            }}
            buttonStyle={{backgroundColor: "#0D93B3"}}
            loading={loader}
          />
        </View>
      </View>
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
        {isCreateNew
          ? <View style={{padding: "2%"}}>
            <Text style={styles.text_footer}>Category Name</Text>
            <View style={styles.action}>
              <TextInput
                placeholder="Enter Category Name"
                style={styles.textInput}
                autoCapitalize="none"
                autoCorrect={false}
                value={category}
                onChangeText={setCategory}
              />
            </View>
            <Button
              title="Save"
              buttonStyle={{backgroundColor: "#0D93B3", marginTop: "5%"}}
              onPress={() => {
                createCategory({
                  name: category
                })
                setIsCreateNew(false)
                refRBSheet.current.close();
              }}
            />
          </View>
          :
          <ScrollView stickyHeaderIndices={[0]}>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <View style={{ flex: 1 }}>
                <Button
                  title="Create New Category"
                  buttonStyle={{backgroundColor: "#0D93B3", marginBottom: "5%"}}
                  onPress={() => {
                    setIsCreateNew(true);
                    setCategory("");
                  }}
                />
              </View>
            </View>
            {state.productCategories.map((res, i) => (
              <View key={res._id} style={styles.containerRadio}>
                <TouchableOpacity
                  onPress={() => {
                    setNameCat(res._id);
                    setCategory(res.name);
                    refRBSheet.current.close();
                  }}
                  style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}
                >
                  <Text style={styles.radioText}>{res.name}</Text>
                  <View
                    style={styles.radioCircle}
                  >
                    {nameCat === res._id && <View style={styles.selectedRb} />}
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        }
      </RBSheet>
      <RBSheet
        ref={refRBSheetUnit}
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
      {isUnitSelection 
        ? <ScrollView>
        {state.productUnits.map((unit, i) => (
              <View key={unit._id} style={styles.containerRadio}>
                <TouchableOpacity
                  onPress={() => {
                    if(!isSecondary) {
                      setPrimaryUnit(unit.name)
                    } else {
                      setSecondaryUnit(unit.name)
                      setIsSecondary(false)
                    }
                    setSelectedUnit("")
                    setIsUnitSelection(false)
                  }}
                  style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}
                >
                  <Text style={styles.radioText}>{unit.name}</Text>
                  <View
                    style={styles.radioCircle}
                  >
                    {selectedUnit === unit._id && <View style={styles.selectedRb} />}
                  </View>
                </TouchableOpacity>
              </View>
            ))}
        </ScrollView>
        : <ScrollView stickyHeaderIndices={[0]}>
        <View>
          <Button
            title={primaryUnit?primaryUnit:"Select Primary Unit"}
            buttonStyle={{backgroundColor: "#0D93B3", marginBottom: "5%"}}
            onPress={() => {
              setIsUnitSelection(true)
              if(primaryUnit && state.productUnits.length) {
                let selectedUnitFind = state.productUnits.find(item => item.name === primaryUnit);
                setSelectedUnit(selectedUnitFind._id);
              }
            }}
          />
          <Button
            title={secondaryUnit?secondaryUnit:"Select Secondary Unit"}
            buttonStyle={{backgroundColor: "#0D93B3", marginBottom: "5%"}}
            onPress={() => {
              setIsUnitSelection(true);
              setIsSecondary(true);
              if(secondaryUnit && state.productUnits.length) {
                let selectedUnitFind = state.productUnits.find(item => item.name === primaryUnit);
                setSelectedUnit(selectedUnitFind._id);
              }
            }}
          />
          <Button
            title="Done?"
            buttonStyle={{backgroundColor: "#0D93B3", marginBottom: "5%"}}
            onPress={() => {
              refRBSheetUnit.current.close();
            }}
          />
        </View>
      <Overlay
        isVisible={isUnitSelection}
        onBackdropPress={() => { setIsUnitSelection(false) }}
        overlayStyle={{ width: "70%", height: "70%" }}
      >
        <FlatList
          style={styles.list}
          data={state.productUnits}
          keyExtractor={item => item._id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                key={item._id}
                onPress={() => {
                  if(!isSecondary) {
                    setPrimaryUnit(item.name)
                  } else {
                    setSecondaryUnit(item.name)
                  }
                  setIsUnitSelection(false)
                }}
              >
                <ListItem bottomDivider>
                  <Avatar style={styles.avtar} title={item.name[0]} />
                  <ListItem.Content>
                    <ListItem.Title>{item.name}</ListItem.Title>
                  </ListItem.Content>
                </ListItem>
              </TouchableOpacity>
            );
          }}
        />
      </Overlay>
    </ScrollView> 
      }
        
      </RBSheet>
    </View>
  );
};

ProductForm.defaultProps = {
  product: {
    name: "",
    skuCode: "",
    category: "",
    primaryUnit: "",
    secondaryUnit: "",
    sellingPrice: "",
    purchasingPrice: "",
    unitConversion: [
      {
        unit: "",
        factor: ""
      }
    ],
    tax: 0,
    discount: 0,
    parLevel: 0,
    description: "",
    shelf: "",
    inventory: {
      currentStock: 0,
    }
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  header: {
    margin: 30,
    marginTop: 40
  },
  text_header: {
    color: "white",
    fontSize: "bold",
    fontSize: 30
  },
  text_footer: {
    color: "#05375a",
    fontSize: 20
  },
  action: {
    marginTop: 8,
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
  },
  error: {
    fontSize: 15,
    color: "red",
    marginTop: 20
  },
  list: {
    height: "93.5%",
},
  containerRadio: {
    marginBottom: 5,
    padding: "4%",
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radioText: {
    marginRight: 35,
    fontSize: 14,
    color: '#000',
    fontWeight: '700'
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRb: {
    width: 10,
    height: 10,
    borderRadius: 50,
    backgroundColor: 'black',
  },
  result: {
    marginTop: 20,
    color: 'white',
    fontWeight: '600',
    backgroundColor: '#F3FBFE',
  }
});

export default ProductForm;
