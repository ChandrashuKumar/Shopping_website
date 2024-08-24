import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    addresses: [],
}

const addressSlice = createSlice({
    name:'address',
    initialState,
    reducers:{
        addAddress : (state,action) =>{
            const address = action.payload
            state.addresses.push(address)
        },
        removeAddress : (state,action) =>{
            const addressId = action.payload;
            state.addresses = state.addresses.filter(addr => addr.id !==addressId)
        }
    }
})

export const {addAddress, removeAddress} = addressSlice.actions

export default addressSlice.reducer