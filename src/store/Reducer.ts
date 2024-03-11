import {createSlice} from '@reduxjs/toolkit';
import {Book} from '../models/ResponseType';

export interface bookInterface {
  bookItem: Book | null;
}

const initialState: bookInterface = {
  bookItem: null,
};

export const BookReducer = createSlice({
  name: 'book',
  initialState,
  reducers: {
    storeBookInfo: (state, action) => {
      state.bookItem = action.payload;
    },
  },
});

export const {storeBookInfo} = BookReducer.actions;
export default BookReducer.reducer;
