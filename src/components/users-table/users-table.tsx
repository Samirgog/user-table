import { DeleteOutlined } from '@ant-design/icons'
import React, { useMemo, useState } from 'react'
import ResizeObserver from 'rc-resize-observer'
import { Form, Image, Modal, Table, TableColumnsType } from 'antd'
import dayjs from 'dayjs'

import { IUser } from '../../models'
import { IUsersTableProps } from './types'

import './users-table.less'
import { useAppDispatch } from '../../store'
import { deleteUser, editUser } from '../../store/users/thunks'
import Input from 'rc-input'
import { IUserEditFields } from 'store/users/types'

export const UsersTable = ({ loading, users }: IUsersTableProps) => {
  const [ height, setTableHeight ] = useState(undefined)
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();

  const dispatch = useAppDispatch()

  const columns: TableColumnsType<IUser> = useMemo(() => [
    {
      dataIndex: 'picture',
      width: 64,
      render: ({ thumbnail, large }) => <Image src={thumbnail} preview={{ src: large }} alt="photo" />
    },
    {
      title: 'Имя пользователя',
      dataIndex: [ 'login', 'username' ]
    },
    {
      title: 'Полное имя',
      dataIndex: 'name',
      render: ({ title, first, last }) => `${title} ${first} ${last}`
    },
    {
      title: 'Email',
      dataIndex: 'email'
    },
    {
      title: 'Телефон',
      dataIndex: 'cell'
    },
    {
      title: 'Возраст',
      dataIndex: [ 'dob', 'age' ]
    },
    {
      title: 'Дата регистрации',
      dataIndex: [ 'registered', 'date' ],
      render: (date: string) => dayjs(date).format('D MMMM YYYY ')
    },
    {
      title: 'Удалить',
      dataIndex: 'delete',
      render: (_, user: IUser) => <DeleteOutlined onClick={() => dispatch(deleteUser(user.login.uuid))}/>
    }
  ], [])

  const handleCancel = () => setSelectedUser(null)

  const handleFormSubmit = (values: IUserEditFields) => {
    dispatch(editUser(selectedUser?.login?.uuid, values))
    setSelectedUser(null)
  }

  const heighDelta = 39 // 39 - высота заголовка таблицы
  return <ResizeObserver onResize={({ height: componentHeight }) => setTableHeight(Math.max(0, componentHeight - heighDelta))}>
    <Modal visible={selectedUser} onCancel={handleCancel} onOk={form.submit}>
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        onFinish={handleFormSubmit}
      >
        <Form.Item name="name" label="Name">
          <Input defaultValue={selectedUser?.name?.first} />
        </Form.Item>
        <Form.Item name="email" label="Email">
          <Input defaultValue={selectedUser?.email} />
        </Form.Item>
        <Form.Item name="phone" label="Phone">
          <Input defaultValue={selectedUser?.phone} />
        </Form.Item>
        <Form.Item name="cell" label="Cell">
          <Input defaultValue={selectedUser?.cell} />
        </Form.Item>
        <Form.Item name="dob" label="Dob">
          <Input defaultValue={selectedUser?.dob?.date} />
        </Form.Item>
      </Form>
    </Modal>
    <div className="users-table">
      <Table 
        size="small" 
        loading={loading} 
        dataSource={users} 
        columns={columns}
        scroll={{ y: height }} 
        pagination={false} 
        rowKey={keySelector}
        onRow={(user) => ({ onDoubleClick: () => setSelectedUser(user) })} />
    </div>
  </ResizeObserver>
}

const keySelector = (user: IUser) => user.login.uuid
