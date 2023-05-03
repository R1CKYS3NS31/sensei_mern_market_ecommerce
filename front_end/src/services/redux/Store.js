import { configureStore } from "@reduxjs/toolkit";
import foodReducer from './slices/FoodSlice'
// import deficiencyReducer from './slices/DeficiencySlice'
// import conditionReducer from './slices/ConditionSlice'
// import recipeReducer from './slices/RecipeSlice'

// edit

const store = configureStore({
    reducer: {
        // Define a top-level state field named `foods`, handled by `foodsReducer`
        foods: foodReducer,
        // conditions: conditionReducer,
        // deficiencies: deficiencyReducer,
        // recipes:recipeReducer
    },
})
export default store