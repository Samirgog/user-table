import { createAction, createAsyncThunk } from '@reduxjs/toolkit'

import { randomuser } from '../../utils'
import { IUserEditFields } from './types'

export const generate = createAsyncThunk(
  'users.generate',
  async (count: number) => {
    const users = await randomuser(count)
    return users
  }
)

/**
 * Добавить пользователя.
 */
export const addUser = createAsyncThunk(
  'users.addUser',
  async () => {
    const user = await randomuser(1)
    return user[0]
  }
)

/**
 * Удалить пользователя.
 * 
 * @param id Идентификатор пользователя.
 */
export const deleteUser = createAction('users.deleteUser', (id: string) => ({payload: id}))

/**
 * Редактировать пользователя.
 * 
 * @param id Идентификатор пользователя.
 * @param values Измененные данные.
 */
export const editUser = createAction('users.editUser', (id: string, values: IUserEditFields) => ({payload: {id, values}}))