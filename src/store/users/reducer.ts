import { createReducer } from '@reduxjs/toolkit'

import { IUsersState } from './types'

import { addUser, deleteUser, editUser, generate } from './thunks'

const initialState: IUsersState = {
  fetching: false,
  users: []
}

export const usersReducer = createReducer(initialState, builder =>
  builder
    .addCase(generate.pending, (state) => ({ ...state, fetching: true }))
    .addCase(generate.fulfilled, (state, { payload }) => ({ ...state, fetching: false, users: [ ...payload ] }))
    .addCase(generate.rejected, (state) => ({ ...state, fetching: false, users: [] }))
    .addCase(addUser.pending, (state) => ({ ...state, fetching: true }))
    .addCase(addUser.fulfilled, (state, { payload }) => ({ ...state, fetching: false, users: [ payload, ...state.users ] }))
    .addCase(addUser.rejected, (state) => ({ ...state, fetching: false, users: [] }))
    .addCase(deleteUser, (state, {payload}) => ({...state, users: state.users.filter((user) => user.login.uuid !== payload)}))
    .addCase(editUser, (state, {payload: {id, values}}) => {
      const user = state.users.find((user) => user.login.uuid === id)
      const now = new Date()
      const newDob = new Date(values.dob)
      const newAge = Math.floor((+now - +newDob) / 1000 / 60 / 60 / 24 / 365)

      const newUser = {...user, cell: values.cell, email: values.email, phone: values.phone, name: {...user.name, first: values.name}, dob: {age: newAge, date: values.dob}}
      
      return {...state, users: [newUser, ...state.users.filter((user) => user.login.uuid !== id)]}
    })
  )
