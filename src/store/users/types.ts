import { IUser } from 'models'

export interface IUsersState {
  fetching: boolean
  users: IUser[]
}

export interface IUserEditFields {
  name?: string;
  email?: string;
  phone?: string;
  cell?: string;
  dob?: string;
}