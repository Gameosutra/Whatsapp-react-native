import createDataContext from "./createDataContext";
import TrackerApi from "../api/tracker";
import { AsyncStorage } from "react-native";
import { navigate } from "../navigationRef";
import Toast from 'react-native-toast-message';

const InvoiceReducer = (state, action) => {
  switch (action.type) {
    case "fetch_invoices":
      return {
        ...state,
        invoices: action.payload.invoices,
        offset: action.payload.offset,
        total: action.payload.total,
        loader: false,
        loadingMore: false,
        refreshing: false
      };
    case "clear_data":
      return {
        ...state,
        offset: 0,
        limit: 10,
        errorMessage: "",
        invoices: [],
        loader: false,
        refreshing: false,
        addedProducts: [],
        addedProductsHash: []
      };
    case "clear_data_invoice":
      return {
        ...state,
        selectedInvoiceDetails: {},
        productsTaxAmount: 0,
        productsDiscountAmount: 0,
        subTotalAmount: 0,
        totalAmount: 0,
        discountOnInvoice: 0,
      };
    case "addedProductManagment":
      return {
        ...state,
        addedProducts: action.payload.addedProducts,
        addedProductsHash: action.payload.addedProductsHash,
        subTotalAmount: action.payload.subTotalAmount,
        productsTaxAmount: action.payload.productsTaxAmount,
        productsDiscountAmount: action.payload.productsDiscountAmount,
        totalAmount: action.payload.totalAmount
      }
    case "set_invoice_details":
      return {
        ...state,
        selectedInvoiceDetails: action.payload.selectedInvoiceDetails,
        loader: false
      }
    case "set_parties":
      return {
        ...state,
        parties: action.payload.parties
      }
    case "Update_Invoice":
      return {
        ...state,
        productsTaxAmount: action.payload.totalTaxAmount,
        productsDiscountAmount: action.payload.totalItemDiscount,
        subTotalAmount: action.payload.subTotal,
        totalAmount: action.payload.total,
        discountOnInvoice: action.payload.discountOnInvoice,
        addedProductsHash: action.payload.addedProductsHash,
        addedProducts: action.payload.addedProducts
      }
    case "create_invoice":
      return { ...state, loader: false }
    case "add_error":
      return { ...state, errorMessage: action.payload, loader: false };
    case "setLoader":
      return { ...state, loader: true, loadingMore: true };
    case "setLoadMore":
      return { ...state, loadingMore: true };
    case "setRefreshing":
      return { ...state, refreshing: true };
    default:
      return state;
  }
};

const clearDataOfInvoiceList = dispatch => () => {
  dispatch({ type: "clear_data" });
};

const clearDataForSelectedInvoice = dispatch => () => {
  dispatch({ type: "clear_data_invoice" })
}

const fetchInvoices = dispatch => async (payload) => {
  (payload.offset === 0) && dispatch({ type: "setLoader" });
  (payload.refreshing) && dispatch({ type: "setRefreshing" });
  (payload.loadMore) && dispatch({ type: "setLoadMore" });
  try {
    const response = await TrackerApi.get(`/api/list-invoices`, {
      params: {
        limit: payload.limit,
        offset: payload.offset,
        ...(payload.searchFilter) && { searchFilter: payload.searchFilter },
        ...(payload.seller) && { isPos: 1 },
      }
    });
    let tempTotal = response.data.data.total;
    let tempInvoices = payload.offset === 0
      ? Array.from(response.data.data.invoices)
      : [...payload.invoices, ...response.data.data.invoices];

    dispatch({
      type: "fetch_invoices",
      payload: {
        invoices: tempInvoices,
        total: tempTotal,
        offset: payload.offset,
        limit: payload.limit
      }
    });
  } catch (err) {
    Toast.show({
      type: 'error',
      text1: err.response.data.message
    });
    dispatch({ type: 'add_error' });
  }

};

const addProductsInInvoice = dispatch => (payload, callback) => {
  let isThere = false;
  let tempAddedProducts = payload.addedProducts;
  if (payload.isAdd) {
    if (tempAddedProducts.length > 0) {
      tempAddedProducts.forEach((item) => {
        if (item.product === payload.product.product) {
          item.quantity = payload.product.quantity * 1;
          item.price = payload.product.price * 1;
          item.tax = payload.product.tax * 1;
          item.discount = payload.product.discount * 1;
          isThere = true
        }
      })
    }
    if (!isThere) {
      tempAddedProducts = [payload.product, ...tempAddedProducts]
    }
  } else {
    tempAddedProducts.forEach((item, index) => {
      if (item.product === payload.product._id) {
        tempAddedProducts.splice(index, 1);
      }
    })
  }

  let tempHsh = [];
  let tempProductDiscount = 0;
  let tempProductTax = 0;
  let tempSubTotal = 0;
  if (tempAddedProducts.length > 0) {
    tempAddedProducts.forEach(item => {
      tempHsh.push(item._id);
      let tempAmount = 0;
      tempProductDiscount = tempProductDiscount * 1 + (((item.price * 1 * item.quantity * 1) * item.discount) / 100);
      tempAmount = (item.price * 1 * item.quantity * 1) - (((item.price * 1 * item.quantity * 1) * item.discount) / 100);
      tempProductTax = tempProductTax * 1 + ((tempAmount * item.tax) / 100);
      tempSubTotal = tempSubTotal * 1 + (item.price * 1 * item.quantity * 1);
    })
  }
  const tempTotalAmount = tempSubTotal * 1 + tempProductTax - tempProductDiscount;
  // - ((state.invoiceDiscountAmount * 1 * tempSubTotal) / 100)

  dispatch({
    type: "addedProductManagment",
    payload: {
      addedProducts: tempAddedProducts,
      addedProductsHash: tempHsh,
      subTotalAmount: tempSubTotal,
      productsTaxAmount: tempProductTax,
      productsDiscountAmount: tempProductDiscount,
      totalAmount: tempTotalAmount
    }
  });
  callback();
}

const createInvoice = dispatch => async (payload,navigation) => {
  dispatch({ type: "setLoader" });
  try {
    const response = await TrackerApi.post(`/api/invoice`, payload);
    dispatch({ type: "create_invoice" });
    dispatch({ type: "clear_data" });
    Toast.show({
      type: 'success',
      text1: response.data.message
    });
    navigation.navigate("InvoiceDetail", { _id: response.data._id });
  } catch (err) {
    Toast.show({
      type: 'error',
      text1: err.response.data.message
    });
    dispatch({ type: 'add_error' });
  }
};

const updateInvoiceById = dispatch => async (payload,navigation) => {
  dispatch({ type: "setLoader" });
  try {
    const response = await TrackerApi.put(`/api/invoice/${payload._id}`, payload);
    dispatch({ type: "create_invoice" });
    dispatch({ type: "clear_data" });
    if (payload._id) {
      navigation.navigate("InvoiceDetail", { _id: payload._id });
    } else {
      navigation.navigate("InvoiceList");
    }
    Toast.show({
      type: 'success',
      text1: response.data.message
    });
  } catch (err) {
    Toast.show({
      type: 'error',
      text1: err.response.data.message
    });
    dispatch({ type: 'add_error' });
  }
};

const fetchInvoiceDetail = dispatch => async (_id) => {
  dispatch({ type: "setLoader" });
  try {
    const response = await TrackerApi.get(`/api/invoice/${_id}`);
    dispatch({
      type: "set_invoice_details", payload: {
        selectedInvoiceDetails: response.data.data,
      }
    });
  } catch (err) {
    Toast.show({
      type: 'error',
      text1: err.response.data.message
    });
    dispatch({ type: 'add_error' });
  }
};

const fetchParties = dispatch => async () => {
  try {
    const response = await TrackerApi.get(`/api/myParties`);
    dispatch({
      type: "set_parties", payload: {
        parties: response.data.data.parties,
      }
    });
  } catch (err) {
    Toast.show({
      type: 'error',
      text1: err.response.data.message
    });
    dispatch({ type: 'add_error' });
  }
};

const updateInvoice = (dispatch) => async (payloadInvoice,navigation) => {
  let tempSelectedInvoice = { ...payloadInvoice };
  let tempInvoiceProducts = tempSelectedInvoice.items.map(item => {
    return {
      ...item.product,
      ...item,
      _id: item.product._id,
      product: item.product._id,
    };
  });
  let tempHsh = [];
  if (tempInvoiceProducts.length > 0) {
    tempInvoiceProducts.forEach(item => {
      tempHsh.push(item._id);
    })
  }
  dispatch({
    type: "Update_Invoice", payload: {
      ...payloadInvoice,
      addedProducts: tempInvoiceProducts,
      addedProductsHash: tempHsh,
    }
  })
  navigation.navigate("InvoiceCreate", { isPos: payloadInvoice.isPos ? payloadInvoice.isPos : false });
}


export const { Provider, Context } = createDataContext(
  InvoiceReducer,
  {
    fetchInvoices,
    clearDataOfInvoiceList,
    addProductsInInvoice,
    createInvoice,
    fetchParties,
    fetchInvoiceDetail,
    updateInvoice,
    updateInvoiceById,
    clearDataForSelectedInvoice
  },
  {
    errorMessage: "",
    addedProducts: [],
    addedProductsHash: [],
    invoices: [],
    loader: false,
    limit: 10,
    offset: 0,
    total: 20,
    refreshing: false,
    loadingMore: false,
    productsTaxAmount: 0,
    productsDiscountAmount: 0,
    subTotalAmount: 0,
    totalAmount: 0,
    discountOnInvoice: 0,
    parties: [],
    selectedInvoiceDetails: {}
  }
);
