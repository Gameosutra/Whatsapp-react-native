import React, { useContext } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { NavigationEvents } from 'react-navigation';

import { Context as ProductContext } from '../../context/ProductContext';
import ProductForm from '../../components/ProductForm';

const ProductCreateScreen = ({ navigation }) => {
    const { state, createProduct, clearErrorMessage } = useContext(ProductContext);
    return (
            <ScrollView>
            <NavigationEvents onWillBlur={clearErrorMessage} />
            <ProductForm 
                error={state.errorMessage}
                onSubmit={(obj) => {
                    createProduct(obj,navigation) 
                }} 
                onSubmitButton="Create Product"
                title="Create New Product"
                loader = {state.loader}
                />
        </ScrollView>
    );
}
ProductCreateScreen.navigationOptions = () => {
    return {
        header: () => false
    }
}

const styles = StyleSheet.create({

});

export default ProductCreateScreen;