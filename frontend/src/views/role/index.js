import { Fragment, useEffect, useMemo, useState } from 'react'
import { getAccountData } from '@auth/utils'
import { useDispatch, useSelector } from 'react-redux'
import { AccountSelectData, AccountList, AccountUpdate, AccountRemove, AccountShow, AccountSelectAllData, resetSelectedData, AccountSetParams, setLoading, setPage } from './store'
import { BrowserRouter as Router, Link, useLocation } from 'react-router-dom'

import Item from './Item'
import Sidebar from './Sidebar'
import classnames from 'classnames'

import './style.scss'

const useQuery = () => {
  const { search } = useLocation()

  return useMemo(() => new URLSearchParams(search), [search])
}

const index = () => {
  const queryURL = useQuery()

  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(5)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modalCreateOpen, setModalCreateOpen] = useState(false)

  const dispatch = useDispatch()
  const store = useSelector(state => state.account)
  const auth = getAccountData()

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const fetchData = async () => {
        try {
          dispatch(setLoading(true))
          await dispatch(
            AccountList({
              search: store.filter.search || '',
              limit: store.limit || 20,
              page: store.page,
              kategori: queryURL.get('kategori'),
              role: queryURL.get('role')
            })
          )
          dispatch(setLoading(false))
        } catch (err) {
          dispatch(setLoading(false))
        }
      }
      fetchData()
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [store.page, queryURL.get('kategori'), queryURL.get('role')])

  const loadMore = () => {
    dispatch(setPage(2))
  }

  return (
    <Fragment>
      <Sidebar queryURL={queryURL} store={store} dispatch={dispatch} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} resetSelectedData={resetSelectedData} modalCreateOpen={modalCreateOpen} setModalCreateOpen={setModalCreateOpen} />
      <div className="content-right">
        <div className="content-body">
          <div
            className={classnames('body-content-overlay', {
              show: store.loading || sidebarOpen
            })}
            onClick={() => setSidebarOpen(false)}
          ></div>
          <Item
            store={store}
            search={search}
            limit={limit}
            setSearch={setSearch}
            setLimit={setLimit}
            dispatch={dispatch}
            AccountSelectData={AccountSelectData}
            updateData={AccountUpdate}
            removeData={AccountRemove}
            listData={AccountList}
            showData={AccountShow}
            setParams={AccountSetParams}
            AccountSelectAllData={AccountSelectAllData}
            setSidebarOpen={setSidebarOpen}
            resetSelectedData={resetSelectedData}
            loadMore={loadMore}
          />
        </div>
      </div>
    </Fragment>
  )
}

export default index
