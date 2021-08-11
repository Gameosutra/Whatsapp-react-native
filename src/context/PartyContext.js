import createDataContext from "./createDataContext";
import TrackerApi from "../api/tracker";
import { navigate } from "../navigationRef";
import Toast from "react-native-toast-message";

const PartyReducer = (state, action) => {
  switch (action.type) {
    case "party_detail":
      return { ...state, currentParty: action.payload, loader: false, bottomLoader: false };
    case "fetch_parties":
      return { ...state, parties: action.payload.parties, offset: action.payload.offset, loader: false, bottomLoader: false };
    case "party":
      return {
        ...state,
        parties: [...state.parties, action.payload],
        errorMessage: "",
        loader: false,
        bottomLoader: false
      };
    case "clear_data":
      return {
        errorMessage: "",
        parties: [],
        loader: false,
        bottomLoader: false
      };
    case "add_error":
      return { ...state, errorMessage: action.payload, loader: false, bottomLoader: false };
    case "setLoader":
      return { ...state, loader: true, bottomLoader: false };
    case "bottomLoader":
      return { ...state, bottomLoader: true }
    default:
      return state;
  }
};

const clearData = dispatch => () => {
  dispatch({ type: "clear_data" });
};

const findParty = dispatch => async id => {
  try {
    dispatch({ type: "setLoader" });
    const response = await TrackerApi.get("/api/business/" + id);
    dispatch({ type: "party_detail", payload: response.data.data });
  } catch (err) {
    let errMsg = err && err.response && err.response.data && err.response.data.message ? err.response.data.message : 'Something went wrong with Sign In';
    Toast.show({
      type: 'error',
      text1: err.response.data.message
    });
    dispatch({ type: 'add_error', payload: errMsg });
  }
};

const fetchParties = dispatch => async (parties, searchFilter, limit = 10, offset = 0) => {
  try {
    if (offset > parties.length) return;
    if (offset == 0) dispatch({ type: "setLoader" });
    else dispatch({ type: 'bottomLoader' });
    const response = await TrackerApi.get("/api/myParties", {
      params: { searchFilter, limit, offset }
    });

    let oldParties = parties ? parties : []
    let finalParties = [...oldParties, ...response.data.data.parties];
    let finalOffset = offset + limit

    dispatch({
      type: "fetch_parties",
      payload: {
        parties: finalParties,
        offset: finalOffset
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

const addContactToRS = dispatch => async (partyDetails) => {
  dispatch({ type: "setLoader" });
  try {
    let phone = partyDetails.phoneNumbers && partyDetails.phoneNumbers.length ? partyDetails.phoneNumbers[0].number : null;
    if (!phone) {
      dispatch({
        type: "add_error",
        payload: "Phone Number is not present in the contact"
      });
    }
    let businessName = partyDetails.firstName
    const response = await TrackerApi.patch("/api/add-party", {
      businessName,
      phone
    });
    dispatch({ type: "party", payload: response.data.data });
    Toast.show({
      type: 'success',
      text1: response.data.message
    });
    navigate("PartiesList");
  } catch (err) {
    Toast.show({
      type: 'error',
      text1: err.response.data.message
    });
    dispatch({ type: 'add_error' });
  }
};

const editParty = dispatch => async ({
  party,
  businessName,
  phone,
  brandName,
  city,
  state
}) => {
  dispatch({ type: "setLoader" });
  try {
    const response = await TrackerApi.put(`/api/business/${party._id}`, {
      businessName,
      phone,
      brandName,
      city,
      state
    });
    dispatch({ type: "party_detail", payload: response.data.data });
    Toast.show({
      type: 'success',
      text1: response.data.message
    });
    navigate("PartyDetail", { _id: party._id });
  } catch (err) {
    Toast.show({
      type: 'error',
      text1: err.response.data.message
    });
    dispatch({ type: 'add_error' });
  }
};

export const { Provider, Context } = createDataContext(
  PartyReducer,
  {
    addContactToRS,
    editParty,
    clearData,
    fetchParties,
    findParty,
  },
  {
    errorMessage: "",
    parties: [],
    currentParty: null,
    loader: false
  }
);
