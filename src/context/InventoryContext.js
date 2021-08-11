import createDataContext from "./createDataContext";
import TrackerApi from "../api/tracker";
import { navigate } from "../navigationRef";
import { InventoryLogsReasonsHash } from '../utils/constants';
import Toast from 'react-native-toast-message';

const InventoryReducer = (state, action) => {
  switch (action.type) {
    case "fetch_logs":
      return {
        ...state,
        inventoryLogs: action.payload.logs,
        offset: action.payload.offset,
        inventoryLoader: false,
        bottomLoader: false
      };
    case "addedProductManagment":
      return {
        ...state,
        addedProducts: action.payload.addedProducts,
        addedProductsHash: action.payload.addedProductsHash,
      }
    case "setInventoryLoader":
      return { ...state, inventoryLoader: true, bottomLoader: false };
    case "inventoryCreate":
      return { ...state, inventoryLoader: false, bottomLoader: false };
    case "add_error":
      return { ...state, errorMessage: action.payload, inventoryLoader: false, bottomLoader: false };
    case "clear_data":
      return {
        ...state,
        addedProducts: [],
        addedProductsHash: [],
        isVisible: false,
        inventoryLogs: [],
        inventoryLoader: false,
        bottomLoader: false
      }
    case "bottomLoader":
      return { ...state, bottomLoader: true }
    case "inventoryLogsList":
      return { ...state, logs: action.payload, inventoryLoader: false }
    default:
      return state;
  }
};

const createInventoryClearData = dispatch => () => {
  dispatch({ type: "clear_data" });
}
const fetchInventoryLogs = dispatch => async (logs, referenceNo, limit = 20, offset = 0, reason) => {
  try {
    if (offset > logs.length) return;
    if (offset == 0) dispatch({ type: "setInventoryLoader" });
    else dispatch({ type: 'bottomLoader' });

    const response = await TrackerApi.get("/api/inventorylogs-history", {
      params: {
        referenceNo,
        limit,
        offset,
        reason: InventoryLogsReasonsHash[reason]
      }
    });
    let oldLogs = logs ? logs : []
    let finalLogs = [...oldLogs, ...response.data.data.logs];
    console.log(finalLogs)
    let finalOffset = offset + limit
    dispatch({
      type: "fetch_logs",
      payload: { logs: finalLogs, offset: finalOffset }
    });
  } catch (err) {
    Toast.show({
      type: 'error',
      text1: err.response.data.message
    });
    dispatch({ type: 'add_error' });
  }
};

const addProductsInInventory = dispatch => (payload, callback) => {
  let isThere = false;
  let tempAddedProducts = payload.addedProducts;
  if (payload.isAdd) {
    if (tempAddedProducts.length > 0) {
      tempAddedProducts.forEach((item) => {
        if (item.product === payload.product.product) {
          item.adjustment = payload.product.adjustment * 1;
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

  if (tempAddedProducts.length > 0) {
    tempAddedProducts.forEach(item => {
      tempHsh.push(item._id);
    })
  }
  dispatch({
    type: "addedProductManagment",
    payload: {
      addedProducts: tempAddedProducts,
      addedProductsHash: tempHsh
    }
  });
  callback();
}

const adjustInventory = dispatch => async inventoryData => {
  dispatch({ type: "setInventoryLoader" });
  try {
    const response = await TrackerApi.post(
      `/api/take-inventory/${inventoryData.reason}`,
      inventoryData.addedProducts
    );
    dispatch({ type: "inventoryCreate" });
    dispatch({ type: "clear_data" });
    Toast.show({
      type: 'success',
      text1: response.data.message
    });
    navigate("InventoryList", { type: inventoryData.type });
  } catch (err) {
    Toast.show({
      type: 'error',
      text1: err.response.data.message
    });
    dispatch({ type: 'add_error' });
  }
};


const clearData = dispatch => () => {
  dispatch({ type: "clear_data" });
};

const getInventoryLogs = dispatch => async (referenceNo) => {
  try {
    dispatch({ type: "setInventoryLoader" });
    const response = await TrackerApi.get(
      "/api/inventorylogs", {
      params: {
        referenceNo
      }
    }
    );
    dispatch({ type: "inventoryLogsList", payload: response.data.data.logs });
  } catch (err) {
    Toast.show({
      type: 'error',
      text1: err.response.data.message
    });
    dispatch({ type: 'add_error' });
  }
}
export const { Provider, Context } = createDataContext(
  InventoryReducer,
  {
    fetchInventoryLogs,
    adjustInventory,
    addProductsInInventory,
    createInventoryClearData,
    clearData,
    getInventoryLogs
  },
  {
    errorMessage: "",
    inventoryLoader: false,
    addedProducts: [],
    addedProductsHash: [],
    isVisible: false
  }
);
