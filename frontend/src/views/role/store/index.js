import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import api from '@configs/api'

export const RoleListAll = createAsyncThunk('role/RoleListAll', async params => {
  const response = await api.get('/api/role/list/all', { params })

  return {
    data: response.data,
    params
  }
})

export const RoleList = createAsyncThunk('role/RoleList', async params => {
  const response = await api.get('/api/role/list', { params })

  return {
    data: response.data,
    params
  }
})

export const RoleUpdate = createAsyncThunk('role/RoleUpdate', async ({ roleUuid, dataToUpdate }, { dispatch, getState }) => {
  const response = await api.post('/api/role/update', { roleUuid, dataToUpdate })
  await dispatch(RoleList(getState().role.params))
  return {
    roleUuid,
    dataToUpdate,
    data: response.data
  }
})

export const RoleRemove = createAsyncThunk('role/RoleRemove', async (roleUuid, { dispatch, getState }) => {
  response = await api.delete(`/api/role/remove/${roleUuid}`)

  await dispatch(RoleList(getState().role.params))

  return roleUuid
})

export const RoleShow = createAsyncThunk('role/RoleShow', async uuid => {
  const response = await api.get('/api/role/show', { uuid })
  return response.data
})

export const roleSlice = createSlice({
  name: 'role',
  initialState: {
    listAll: [],
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
    RoleSetParams: (state, action) => {
      state.params = action.payload
    },
    RoleSelectData: (state, action) => {
      const selectedData = state.selectedData
      if (!selectedData.includes(action.payload)) {
        selectedData.push(action.payload)
      } else {
        selectedData.splice(selectedData.indexOf(action.payload), 1)
      }
      state.selectedData = selectedData
    },
    RoleSelectAllData: (state, action) => {
      const selectAllDataArr = []
      if (action.payload) {
        selectAllDataArr.length = 0
        state.list.forEach(role => selectAllDataArr.push(role.uuid))
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
      .addCase(RoleListAll.fulfilled, (state, action) => {
        const newData = []

        action.payload.data.rows.forEach(row => {
          const dataIndex = state.listAll.findIndex(q => q.uuid === row.uuid)

          if (dataIndex !== -1) {
            state.listAll[dataIndex] = row
          } else {
            newData.push(row)
          }
        })

        state.listAll = [...state.listAll, ...newData]
        state.filter = action.payload.data.filter
        state.loading = false
      })
      .addCase(RoleList.fulfilled, (state, action) => {
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
      .addCase(RoleUpdate.fulfilled, (state, action) => {
        function updateRoleData(role) {
          Object.assign(role, action.payload.dataToUpdate)
        }
        state.list.forEach(role => {
          if (action.payload.roleUuid.includes(role.uuid)) {
            updateRoleData(role)
          }
        })
      })
      .addCase(RoleShow.fulfilled, (state, action) => {
        state.currentData = action.payload
      })
  }
})

export const { RoleSelectData, RoleSelectAllData, resetSelectedData, RoleSetParams, setLoading, setPage } = roleSlice.actions

export default roleSlice.reducer
