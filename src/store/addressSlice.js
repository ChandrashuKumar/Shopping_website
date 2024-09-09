import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  addresses: [], // Initialize with an empty array of addresses
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    // Action to add an address
    addAddress: (state, action) => {
      const address = action.payload;
      state.addresses.push(address);
    },

    // Action to remove an address by its ID (Assuming ID is the document ID)
    removeAddress: (state, action) => {
      const addressId = action.payload;
      state.addresses = state.addresses.filter((addr) => addr.$id !== addressId); // Use $id from Appwrite document
    },

    // Update an address by its ID
    updateAddress: (state, action) => {
      const { id, updatedData } = action.payload;
      const addressIndex = state.addresses.findIndex((addr) => addr.$id === id);
      if (addressIndex !== -1) {
        state.addresses[addressIndex] = { ...state.addresses[addressIndex], ...updatedData };
      }
    },

    // Set all addresses when fetched from database
    setAddresses: (state, action) => {
      state.addresses = action.payload;
    }
  },
});

// Export the actions
export const { addAddress, removeAddress, updateAddress, setAddresses } = addressSlice.actions;

// Export the reducer to be combined in the store
export default addressSlice.reducer;
