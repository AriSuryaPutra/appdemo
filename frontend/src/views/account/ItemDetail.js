// ** React Imports
import { Fragment, useState } from 'react'

// ** Utils
import { formatDate } from '@utils'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Third Party Components
import classnames from 'classnames'

import { Mail, Info, Trash, Edit2, Folder, Trash2, Paperclip, ChevronLeft, CornerUpLeft, CornerUpRight } from 'react-feather'
import PerfectScrollbar from 'react-perfect-scrollbar'

// ** Reactstrap Imports
import { Row, Col, Card, Table, CardBody, CardFooter, CardHeader, DropdownMenu, DropdownItem, DropdownToggle, UncontrolledDropdown } from 'reactstrap'

const ItemDetail = props => {
  // ** Props
  const { dispatch, currentData, openData, setOpenData, updateData, handleToRemove, handleToUpdate, handleToShow, formatDateToMonthShort } = props

  const handleGoBack = () => {
    setOpenData(false)
  }

  const handleReadClick = () => {
    handleToUpdate([currentData.uuid], false)
    handleGoBack()
  }

  return (
    <div
      className={classnames('row-show-details', {
        show: openData
      })}
    >
      {currentData !== null && currentData !== undefined ? (
        <Fragment>
          <div className="row-detail-header">
            <div className="row-header-left d-flex align-items-center">
              <span className="go-back me-1" onClick={handleGoBack}>
                <ChevronLeft size={20} />
              </span>
              <h4 className="email-subject mb-0">{currentData.email}</h4>
            </div>
            <div className="row-header-right ms-2 ps-1">
              <ul className="list-inline m-0">
                {/* <li className="list-inline-item me-1">
                  <span
                    className="action-icon favorite"
                    onClick={() => {
                      dispatch(UserUpdate({ userUuid: [item.uuid], dataToUpdate: { isStarred: !item.isStarred } }))
                    }}
                  >
                    <Star
                      size={18}
                      className={classnames({
                        'text-warning fill-current': item.isStarred
                      })}
                    />
                  </span>
                </li> */}
                <li className="list-inline-item me-1">
                  <UncontrolledDropdown>
                    <DropdownToggle tag="span">
                      <Folder size={18} />
                    </DropdownToggle>
                    <DropdownMenu end>
                      <DropdownItem tag="a" href="/" onClick={e => handleFolderClick(e, 'draft', currentData.uuid)} className="d-flex align-items-center">
                        <Edit2 className="me-50" size={18} />
                        <span>Draft</span>
                      </DropdownItem>
                      <DropdownItem tag="a" href="/" onClick={e => handleFolderClick(e, 'spam', currentData.uuid)} className="d-flex align-items-center">
                        <Info className="me-50" size={18} />
                        <span>Spam</span>
                      </DropdownItem>
                      <DropdownItem tag="a" href="/" onClick={e => handleFolderClick(e, 'trash', currentData.uuid)} className="d-flex align-items-center">
                        <Trash className="me-50" size={18} />
                        <span>Trash</span>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </li>
                <li className="list-inline-item me-1">
                  <span className="action-icon" onClick={handleReadClick}>
                    <Mail size={18} />
                  </span>
                </li>
                <li className="list-inline-item me-1">
                  <span
                    className="action-icon"
                    onClick={() => {
                      handleToRemove([currentData.uuid])
                      handleGoBack()
                    }}
                  >
                    <Trash size={18} />
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Fragment>
      ) : null}
    </div>
  )
}

export default ItemDetail
