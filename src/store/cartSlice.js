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
        updateQuantity: (state, action) => {
            const { itemId, quantity } = action.payload;
            const item = state.items.find(i => i.itemId === itemId);
            if (item) {
              item.quantity = quantity;
            }
        },
    }
})

export const {addItem, removeItem, setCart, updateQuantity} = cartSlice.actions

export default cartSlice.reducer