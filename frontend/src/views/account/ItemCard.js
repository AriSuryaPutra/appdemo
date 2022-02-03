import { Trash, Edit } from 'react-feather'
import { htmlToString } from '@utils'
import { Input, Label } from 'reactstrap'

const ItemCard = props => {
  const { item, dispatch, AccountSelectData, setOpenData, handleToShow, handleToRemove, selectedData, formatDateToMonthShort } = props

  const handleClicUsername = uuid => {
    handleToUpdate([currentData.uuid], false)
    handleGoBack()
  }

  return (
    <li className="d-flex row-data">
      <div className="row-left pe-50">
        <div className="row-action">
          <div className="form-check">
            <Input
              type="checkbox"
              id={`${item.username}-${item.uuid}`}
              onChange={e => e.stopPropagation()}
              checked={selectedData.includes(item.uuid)}
              onClick={e => {
                dispatch(AccountSelectData(item.uuid))
                e.stopPropagation()
              }}
            />
            <Label onClick={e => e.stopPropagation()} for={`${item.username}-${item.uuid}`}></Label>
          </div>
        </div>
      </div>
      <div className="row-body">
        <div className="row-details">
          <div className="row-items">
            <h5 className="mb-25 show-data" tag="a" onClick={() => handleClicUsername(item.uuid)}>
              {item.username}
            </h5>
            <span className="text-truncate">{item.role?.name}</span>
          </div>
          <div className="row-meta-item">
            <span className="action-icon" onClick={() => console.log('DELETE')}>
              <Edit size={18} />
            </span>
            <span className="action-icon" onClick={() => handleToRemove(item.uuid)}>
              <Trash size={18} />
            </span>
          </div>
        </div>
        <div className="row">
          <p className="text-truncate mb-0">{htmlToString(item.email)}</p>
        </div>
      </div>
    </li>
  )
}

export default ItemCard
