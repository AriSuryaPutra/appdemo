import { Link, useHistory, useLocation } from 'react-router-dom'
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { Send, Star, Trash, User } from 'react-feather'

import { Button, ListGroup, ListGroupItem } from 'reactstrap'

import ModalCreate from './ModalCreate'

const Sidebar = props => {
  const localtion = useLocation()
  const { store, sidebarOpen, dispatch, resetSelectedData, setSidebarOpen, modalCreateOpen, setModalCreateOpen, queryURL } = props

  const handleCreateDataClick = () => {
    setModalCreateOpen(true)
    setSidebarOpen(false)
  }

  const handleActiveItem = value => {
    if (queryURL.get('kategori') === value || queryURL.get('role') === value) {
      return true
    } else if (value === 'home' && queryURL.toString() === '') {
      return true
    } else {
      return false
    }
  }

  return (
    <>
      <ModalCreate open={modalCreateOpen} setOpen={setModalCreateOpen} />
      <div
        className={classnames('sidebar-left', {
          show: sidebarOpen
        })}
      >
        <div className="sidebar">
          <div className="sidebar-content email-app-sidebar">
            <div className="email-app-menu">
              <div className="form-group-compose text-center compose-btn">
                <Button className="create-data" color="primary" block onClick={handleCreateDataClick}>
                  Create Data
                </Button>
              </div>
              <PerfectScrollbar className="sidebar-menu-list" options={{ wheelPropagation: false }}>
                <h6 className="section-label mt-1 mb-1 px-2">Account Kategori</h6>
                <ListGroup tag="div" className="list-group-messages">
                  <ListGroupItem tag={Link} to="/account/list" active={handleActiveItem('home')}>
                    <User size={18} className="me-75" />
                    <span className="align-middle">All Account</span>
                  </ListGroupItem>
                  <ListGroupItem tag={Link} to="/account/list?kategori=customer" active={handleActiveItem('customer')}>
                    <User size={18} className="me-75" />
                    <span className="align-middle">Account Customer</span>
                  </ListGroupItem>
                  <ListGroupItem tag={Link} to="/account/list?kategori=staff" active={handleActiveItem('staff')}>
                    <User size={18} className="me-75" />
                    <span className="align-middle">Account Staff</span>
                  </ListGroupItem>
                  {/* <ListGroupItem tag={Link} to="/account/trash" active={handleActiveItem('trash')}>
                    <Trash size={18} className="me-75" />
                    <span className="align-middle">Trash</span>
                  </ListGroupItem> */}
                </ListGroup>
                {queryURL.get('kategori') && queryURL.get('kategori') === 'staff' && (
                  <>
                    <h6 className="section-label mt-3 mb-1 px-2">Account Role</h6>
                    <ListGroup tag="div" className="list-group-labels">
                      <ListGroupItem tag={Link} to="/account/list?kategori=staff&role=ADMIN" active={handleActiveItem('ADMIN')} action>
                        <span className="bullet bullet-sm bullet-primary me-1"></span>
                        ADMIN
                      </ListGroupItem>
                      <ListGroupItem tag={Link} to="/account/list?kategori=staff&role=USER" active={handleActiveItem('USER')} action>
                        <span className="bullet bullet-sm bullet-primary me-1"></span>
                        USER
                      </ListGroupItem>
                    </ListGroup>
                  </>
                )}
              </PerfectScrollbar>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar
