import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import api from '@configs/api'

export const AccountList = createAsyncThunk('account/AccountList', async params => {
  const response = await api.get('/api/account/list', { params })

  return {
    data: response.data,
    params
  }
})

export const AccountUpdate = createAsyncThunk('account/AccountUpdate', async ({ accountUuid, dataToUpdate }, { dispatch, getState }) => {
  const response = await api.post('/api/account/update', { accountUuid, dataToUpdate })
  await dispatch(AccountList(getState().account.params))
  return {
    accountUuid,
    dataToUpdate,
    data: response.data
  }
})

export const AccountRemove = createAsyncThunk('account/AccountRemove', async (accountUuid, { dispatch, getState }) => {
  response = await api.delete(`/api/account/remove/${accountUuid}`)

  await dispatch(AccountList(getState().account.params))

  return accountUuid
})

export const AccountShow = createAsyncThunk('account/AccountShow', async uuid => {
  const response = await api.get('/api/account/show', { uuid })
  return response.data
})

export const accountSlice = createSlice({
  name: 'account',
  initialState: {
    list: [],
    page: 1,
    limit: 20,
    hasMore: false,
    filter: {
      search: ''
    },
    params: {},
    selectedData: [],
    currentData: null,
    loading: false
  },
  reducers: {
    AccountSetParams: (state, action) => {
      state.params = action.payload
    },
    AccountSelectData: (state, action) => {
      const selectedData = state.selectedData
      if (!selectedData.includes(action.payload)) {
        selectedData.push(action.payload)
      } else {
        selectedData.splice(selectedData.indexOf(action.payload), 1)
      }
      state.selectedData = selectedData
    },
    AccountSelectAllData: (state, action) => {
      const selectAllDataArr = []
      if (action.payload) {
        selectAllDataArr.length = 0
        state.list.forEach(account => selectAllDataArr.push(account.uuid))
      } else {
        selectAllDataArr.length = 0
      }
      state.selectedData = selectAllDataArr
    },
    resetSelectedData: state => {
      state.selectedData = []
    },
    setPage: (state, action) => {
      state.page = action.payload
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(AccountList.fulfilled, (state, action) => {
        const newData = []
        let currData = null
        let finalList = null

        action.payload.data.rows.forEach(row => {
          const dataIndex = state.list.findIndex(q => q.uuid === row.uuid)

          if (dataIndex !== -1) {
            state.list[dataIndex] = row

            if (state.currentData !== null && state.currentData !== undefined && state.currentData.uuid === row.uuid) {
              currData = row
            }
          } else {
            newData.push(row)
          }
        })

        state.list = [...state.list, ...newData]

        if (action.payload.params.kategori === 'staff') {
          finalList = state.list.filter(q => q.staff !== null)
        } else if (action.payload.params.kategori === 'customer') {
          finalList = state.list.filter(q => q.customer !== null)
        } else {
          finalList = state.list
        }

        if (action.payload.params.role !== undefined && action.payload.params.role !== null) {
          finalList = state.list.filter(q => q.role?.name === action.payload.params.role)
        }

        state.currentData = currData
        state.list = finalList
        state.hasMore = action.payload.data.hasMore
        state.page = action.payload.data.page
        state.limit = action.payload.data.limit
        state.filter = action.payload.data.filter
        state.loading = false
      })
      .addCase(AccountUpdate.fulfilled, (state, action) => {
        function updateAccountData(account) {
          Object.assign(account, action.payload.dataToUpdate)
        }
        state.list.forEach(account => {
          if (action.payload.accountUuid.includes(account.uuid)) {
            updateAccountData(account)
          }
        })
      })
      .addCase(AccountShow.fulfilled, (state, action) => {
        state.currentData = action.payload
      })
  }
})

export const { AccountSelectData, AccountSelectAllData, resetSelectedData, AccountSetParams, setLoading, setPage } = accountSlice.actions

export default accountSlice.reducer
