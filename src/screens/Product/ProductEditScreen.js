import React, { useContext } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { NavigationEvents } from 'react-navigation';

import { Context as ProductContext } from '../../context/ProductContext';
import ProductForm from '../../components/ProductForm';

const ProductEditScreen = ({ navigation }) => {
    const { state, editProduct, clearErrorMessage } = useContext(ProductContext);
    let product;
    if(state.currentProduct) {
       product = state.currentProduct;
    } else {
       product = {
            name: '',
            skuCode: '',
            category: '',
            baseUnit: '',
            sellingPrice: '',
            purchasingPrice: '',
            brand: ''
        };
    }
    return (
            <ScrollView>
            <NavigationEvents onWillBlur={clearErrorMessage}  />
            <ProductForm 
                error={state.errorMessage}
                product={product}
                onSubmit={(obj) => {
                    editProduct({
                        ...product,
                        ...obj,
                        inventory: {
                            ...product.inventory,
                            ...obj.inventory
                        }
                    },navigation) 
                }} 
                onSubmitButton="Update Product"
                title="Edit Product"
                loader = {state.loader}
                />
        </ScrollView>
    );
}

ProductEditScreen.navigationOptions = () => {
    return {
        header: () => false
    }
}

const styles = StyleSheet.create({

});

export default ProductEditScreen;