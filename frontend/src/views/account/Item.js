import { Fragment, useState } from 'react'
import { formatDateToMonthShort } from '@utils'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Menu, Search, Trash } from 'react-feather'
import { Input, Label, InputGroup, InputGroupText } from 'reactstrap'

import ItemCard from './ItemCard'
import ItemDetail from './ItemDetail'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

const Item = props => {
  const { search, store, page, loadMore, setSearch, setPage, setLimit, dispatch, setParams, listData, updateData, showData, removeData, AccountSelectData, AccountSelectAllData, setSidebarOpen, resetSelectedData } = props
  const { list, selectedData, currentData } = store
  const [openData, setOpenData] = useState(false)

  const handleSelectAll = e => {
    dispatch(AccountSelectAllData(e.target.checked))
  }

  /*eslint-disable */

  const handleToUpdate = (e, folder, uuid = selectedData) => {
    e.preventDefault()
    dispatch(updateData({ accountUuid: uuid, dataToUpdate: { folder } }))
    dispatch(resetSelectedData())
  }

  const handleToShow = uuid => {
    dispatch(showData(uuid))
    dispatch(AccountSelectAllData(false))
  }

  const handleToRemove = async uuid => {
    return MySwal.fire({
      title: 'Apakah anda yakin?',
      text: 'data ini akan terhapus',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Hapus',
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-outline-primary ms-1'
      },
      buttonsStyling: false
    }).then(async result => {
      if (result.value) {
        const process = await dispatch(removeData(uuid))
        if (!process.error) {
          MySwal.fire({
            icon: 'success',
            title: 'Berhasil !',
            text: 'Berhasil',
            customClass: {
              confirmButton: 'btn btn-success'
            }
          })

          dispatch(resetSelectedData())
        }
      }
    })
  }
  /*eslint-enable */

  const renderData = () => {
    if (list.length) {
      return list.map((item, index) => {
        return (
          <ItemCard
            item={item}
            key={index}
            dispatch={dispatch}
            handleToShow={handleToShow}
            handleToRemove={handleToRemove}
            setOpenData={setOpenData}
            AccountSelectData={AccountSelectData}
            updateData={updateData}
            selectedData={selectedData}
            formatDateToMonthShort={formatDateToMonthShort}
          />
        )
      })
    }
  }

  return (
    <Fragment>
      <div className="row-list">
        <div className="app-fixed-search d-flex align-items-center">
          <div className="sidebar-toggle d-block d-lg-none ms-1" onClick={() => setSidebarOpen(true)}>
            <Menu size="21" />
          </div>
          <div className="d-flex align-content-center justify-content-between w-100">
            <InputGroup className="input-group-merge">
              <InputGroupText>
                <Search className="text-muted" size={14} />
              </InputGroupText>
              <Input placeholder="Search Data" value={search} onChange={e => setSearch(e.target.value)} />
            </InputGroup>
          </div>
        </div>
        <div className="app-action">
          <div className="action-left form-check">
            <Input type="checkbox" id="select-all" onChange={handleSelectAll} checked={selectedData.length && selectedData.length === list.length} />
            <Label className="form-check-label fw-bolder ps-25 mb-0" for="select-all">
              Select All
            </Label>
          </div>
          {selectedData.length ? (
            <div className="action-right">
              <ul className="list-inline m-0">
                <li className="list-inline-item">
                  <span className="action-icon" onClick={() => handleToRemove(selectedData)}>
                    <Trash size={18} />
                  </span>
                </li>
              </ul>
            </div>
          ) : null}
        </div>

        <PerfectScrollbar
          className="row-data-list"
          options={{ wheelPropagation: false }}
          onScrollY={container => {
            const bottom = container.scrollHeight - container.scrollTop - container.clientHeight

            if (bottom < 50) {
              loadMore()
            }
          }}
        >
          {list.length ? (
            <ul className="row-media-list">{renderData()}</ul>
          ) : (
            <div className="no-results d-block">
              <h5>Data Not Found</h5>
            </div>
          )}
        </PerfectScrollbar>
      </div>
      <ItemDetail openData={openData} dispatch={dispatch} currentData={currentData} setOpenData={setOpenData} updateData={updateData} handleToRemove={handleToRemove} handleToUpdate={handleToUpdate} formatDateToMonthShort={formatDateToMonthShort} />
    </Fragment>
  )
}

export default Item
