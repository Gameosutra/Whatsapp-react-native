import createDataContext from "./createDataContext";
import TrackerApi from "../api/tracker";
import { AsyncStorage } from "react-native";
import { navigate } from "../navigationRef";
import Toast from 'react-native-toast-message';


const ProductReducer = (state, action) => {
  switch (action.type) {
    case "fetch_products_filters":
      return {
        ...state,
        filters: action.payload.filters
      }
    case "fetch_products_categories":
      return {
        ...state,
        productCategories: action.payload
      }
    case "fetch_products_units":
      return {
        ...state,
        productUnits: action.payload
      }
    case "product_detail":
      return { ...state, currentProduct: action.payload, loader: false };
    case "fetch_products":
      return {
        ...state,
        products: action.payload.products,
        offset: action.payload.offset,
        total: action.payload.total,
        loader: false,
        loadingMore: false,
        refreshing: false
      };
    case "product":
      return {
        ...state,
        errorMessage: "",
        loader: false
      };
    case "clear_data":
      return {
        ...state,
        offset: 0,
        limit: 10,
        errorMessage: "",
        products: [],
        loader: false,
        refreshing: false,
        categoryFilter: [],
        brandFilter: []
      };
    case "adjustListAfterAddition":
      return {
        ...state,
        products: action.payload.products
      }
    case "add_error":
      return { ...state, errorMessage: action.payload, loader: false };
    case "setLoader":
      return { ...state, loader: true, loadingMore: true };
    case "setLoadMore":
      return { ...state, loadingMore: true };
    case "setRefreshing":
      return { ...state, refreshing: true };
    case "setBottomSheet":
      return { ...state, isVisible: action.payload.isVisible };
    case "setFilters":
      return {
        ...state,
        ...(action.payload.brandFilter) && { brandFilter: action.payload.brandFilter },
        ...(action.payload.categoryFilter) && { categoryFilter: action.payload.categoryFilter }
      };
    default:
      return state;
  }
};

const clearData = dispatch => () => {
  dispatch({ type: "clear_data" });
};

const findProduct = dispatch => async id => {
  dispatch({ type: "setLoader" });
  try {
    const response = await TrackerApi.get("/api/product/" + id);
    dispatch({ type: "product_detail", payload: response.data.data });
  } catch (err) {
    Toast.show({
      type: 'error',
      text1: err.response.data.message
    });
    dispatch({
      type: "add_error"
    })
  }
};

const fetchProducts = dispatch => async (payload) => {
  (payload.offset === 0) && dispatch({ type: "setLoader" });
  (payload.refreshing) && dispatch({ type: "setRefreshing" });
  (payload.loadMore) && dispatch({ type: "setLoadMore" });
  try {
    const response = await TrackerApi.get(`/api/list-products`, {
      params: {
        limit: payload.limit,
        offset: payload.offset,
        ...(payload.searchFilter) && { searchFilter: payload.searchFilter },
        ...(payload.brandFilter && payload.brandFilter.length > 0) && { brandFilter: JSON.stringify(payload.brandFilter) },
        ...(payload.categoryFilter && payload.categoryFilter.length > 0) && { categoryFilter: JSON.stringify(payload.categoryFilter) },
      }
    });

    let tempTotal = response.data.data.total;
    let tempProducts = payload.offset === 0
      ? Array.from(response.data.data.products)
      : [...payload.products, ...response.data.data.products];

    // For inventory management
    if (payload.addedProductsHash && payload.addedProductsHash.length > 0) {
      tempProducts = tempProducts.filter(item => {
        if (!payload.addedProductsHash.includes(item._id)) return item;
      })
    }
    dispatch({
      type: "fetch_products",
      payload: {
        products: tempProducts,
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
    dispatch({
      type: "add_error"
    })
  }

};

const fetchProductsFilters = dispatch => async () => {
  try {
    const response = await TrackerApi.get(`/api/product-filters`);
    dispatch({
      type: "fetch_products_filters",
      payload: {
        filters: response.data.data[0],
      }
    });
  } catch (err) {
    Toast.show({
      type: 'error',
      text1: err.response.data.message
    });
  }
};

const createProduct = dispatch => async (obj,navigation) => {
  dispatch({ type: "setLoader" });
  try {
    const response = await TrackerApi.post("/api/product", obj);
    dispatch({ type: "product", payload: response.data.data });
    Toast.show({
      type: 'success',
      text1: response.data.message
    });
    navigation.navigate("ProductDetail", { _id: response.data.data._id });
  } catch (err) {
    Toast.show({
      type: 'error',
      text1: err.response.data.message
    });
    dispatch({
      type: "add_error"
    })
  }
};
const editProduct = dispatch => async (obj,navigation) => {
  dispatch({ type: "setLoader" });
  try {
    const response = await TrackerApi.put(`/api/product/${obj._id}`, obj);
    dispatch({ type: "product_detail", payload: response.data.data });
    Toast.show({
      type: 'success',
      text1: response.data.message
    });
    navigation.navigate("ProductDetail", { _id: obj._id });
  } catch (err) {
    Toast.show({
      type: 'error',
      text1: err.response.data.message
    });
    dispatch({
      type: "add_error",
      payload: "Something went wrong with Product updation"
    });
  }
};

const setBottomSheet = dispatch => async (isVisible) => {
  dispatch({ type: "setBottomSheet", payload: { isVisible } });
}

const setFilters = dispatch => async ({ type, filter, item }) => {
  let tempFilter = [];
  if (filter.includes(item)) {
    tempFilter = filter.filter(sitem => {
      return sitem !== item
    })
  } else {
    tempFilter = [...filter, item]
  }

  dispatch({
    type: "setFilters",
    payload: {
      ...(type === "brand") && { brandFilter: tempFilter },
      ...(type === "category") && { categoryFilter: tempFilter },
    }
  });
}

const adjustListAfterAddition = dispatch => (payload) => {
  let tempAddedProducts = payload.products;
  if (payload.isAdd) {
    tempAddedProducts.forEach((item, index) => {
      if (item._id === payload.product._id)
        tempAddedProducts.splice(index, 1);
    })
  } else {
    tempAddedProducts = [payload.product, ...tempAddedProducts];
  }
  dispatch({
    type: "adjustListAfterAddition",
    payload: {
      products: tempAddedProducts
    }
  });
}

const fetchUnits = dispatch => async () => {
  try {
    const response = await TrackerApi.get(`/api/units`);
    dispatch({
      type: "fetch_products_units",
      payload: response.data.data
    });
  } catch (err) {
    Toast.show({
      type: 'error',
      text1: err.response.data.message
    });
  }
};

const fetchCategories = dispatch => async () => {
  try {
    const response = await TrackerApi.get(`/api/categories`);
    dispatch({
      type: "fetch_products_categories",
      payload: response.data.data
    });
  } catch (err) {
    Toast.show({
      type: 'error',
      text1: err.response.data.message
    });
  }
};

const createCategory = dispatch => async (obj) => {
  try {
    const response = await TrackerApi.post("/api/categories", obj);
    Toast.show({
      type: 'success',
      text1: response.data.message
    });
    const responseCategory = await TrackerApi.get(`/api/categories`);
    dispatch({
      type: "fetch_products_categories",
      payload: responseCategory.data.data
    });

  } catch (err) {
    Toast.show({
      type: 'error',
      text1: err.response.data.message
    });
    dispatch({
      type: "add_error"
    })
  }
};

export const { Provider, Context } = createDataContext(
  ProductReducer,
  {
    createProduct,
    editProduct,
    clearData,
    fetchProducts,
    findProduct,
    fetchProductsFilters,
    setBottomSheet,
    setFilters,
    adjustListAfterAddition,
    fetchCategories,
    fetchUnits,
    createCategory
  },
  {
    errorMessage: "",
    products: [],
    currentProduct: null,
    loader: false,
    limit: 10,
    offset: 0,
    filters: {},
    refreshing: false,
    loadingMore: false,
    isVisible: false,
    brandFilter: [],
    categoryFilter: [],
    productCategories:[],
    productUnits: []
  }
);
