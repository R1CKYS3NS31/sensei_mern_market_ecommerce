import { createSlice } from '@reduxjs/toolkit';

// edit

export const foodSlice = createSlice({
    name: 'foods',
    initialState: [],
    reducers: {
        setFoods: (state, action) => {
            return action.payload
        },
        addFood: (state, action) => {
            const food = {
                // id: new Date(),
                // title: action.payload.title,
                // completed: false,
            }
            state.push(food)
        },
        deleteFood: (state, action) => {
            return state.filter(food => food.id !== action.payload.id)
        }
    },
})

export const { addFood, deleteFood, setFoods } = foodSlice.actions

export default foodSlice.reducer