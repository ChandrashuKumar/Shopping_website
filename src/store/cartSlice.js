import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items:[],
}

const cartSlice = createSlice({
    name:'cart',
    initialState,
    reducers: {
        addItem: (state,action)=>{
            const item = action.payload;
            state.items.push(item);
        },
        removeItem : (state,action) =>{
            const itemId = action.payload;
            state.items = state.items.filter(item=>item.itemId !==itemId);
        },
        setCart: (state, action) => {
            state.items = action.payload;
        },
    }
})

export const {addItem, removeItem, setCart} = cartSlice.actions

export default cartSlice.reducer