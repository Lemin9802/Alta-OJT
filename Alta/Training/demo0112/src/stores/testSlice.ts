import React, { useState } from 'react';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import error from 'console';
export const testSlice = createSlice({
    name: 'test',
    initialState: {
        items: ['Enterprise Semester'] as string[],
        loading: false,
        error: null as string | null,
    },
    reducers: { 
        addItem: (state, action:PayloadAction<string>) => {
            state.items.push(action.payload);
        },
        removeItem: (state, action:PayloadAction<string>) => {
            state.items = state.items.filter(x=>x != action.payload);
        }
    }
});
export const {} = testSlice.actions;
