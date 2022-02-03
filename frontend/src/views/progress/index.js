// ** Custom Components
import AvatarGroup from '@components/avatar-group'

import vuejs from '@src/assets/images/icons/vuejs.svg'
import bootstrap from '@src/assets/images/icons/bootstrap.svg'

// ** Icons Imports
import { MoreVertical, Edit, Trash } from 'react-feather'

// ** Reactstrap Imports
import { Table, Badge, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle, Row, Col, Button } from 'reactstrap'

const Progress = () => {
  return (
    <Table hover responsive>
      <thead>
        <tr>
          <th>Antrian</th>
          <th>Penerimaan</th>
          <th>Pengerjaan</th>
          <th>Kasir</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <span className="align-middle fw-bold">
              <Badge pill color="light-warning" className="me-1">
                DK-1234-AB
              </Badge>
            </span>
          </td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>
            <UncontrolledDropdown>
              <DropdownToggle className="icon-btn hide-arrow" color="transparent" size="sm" caret>
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem href="/" onClick={e => e.preventDefault()}>
                  <Edit className="me-50" size={15} /> <span className="align-middle">Edit</span>
                </DropdownItem>
                <DropdownItem href="/" onClick={e => e.preventDefault()}>
                  <Trash className="me-50" size={15} /> <span className="align-middle">Delete</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </td>
        </tr>
        <tr>
          <td>
            <span className="align-middle fw-bold">
              <Badge pill color="light-warning" className="me-1">
                DK-1234-AB
              </Badge>
            </span>
          </td>
          <td>
            <Badge pill color="light-warning" className="me-1">
              DK-1234-AB
            </Badge>
            PIC: TES
          </td>
          <td>-</td>
          <td>-</td>
          <td>
            <UncontrolledDropdown>
              <DropdownToggle className="icon-btn hide-arrow" color="transparent" size="sm" caret>
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem href="/" onClick={e => e.preventDefault()}>
                  <Edit className="me-50" size={15} /> <span className="align-middle">Edit</span>
                </DropdownItem>
                <DropdownItem href="/" onClick={e => e.preventDefault()}>
                  <Trash className="me-50" size={15} /> <span className="align-middle">Delete</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </td>
        </tr>
        <tr>
          <td>
            <span className="align-middle fw-bold">
              <Badge pill color="light-warning" className="me-1">
                DK-1234-AB
              </Badge>
            </span>
          </td>
          <td>
            <Badge pill color="light-success" className="me-1">
              DK-1234-AB
            </Badge>
            PIC: TES
          </td>
          <td>
            <Badge pill color="light-info" className="me-1">
              DK-1234-AB
            </Badge>
            PIC: TEK1
          </td>
          <td>-</td>
          <td>
            <UncontrolledDropdown>
              <DropdownToggle className="icon-btn hide-arrow" color="transparent" size="sm" caret>
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem href="/" onClick={e => e.preventDefault()}>
                  <Edit className="me-50" size={15} /> <span className="align-middle">Edit</span>
                </DropdownItem>
                <DropdownItem href="/" onClick={e => e.preventDefault()}>
                  <Trash className="me-50" size={15} /> <span className="align-middle">Delete</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </td>
        </tr>
        <tr>
          <td>
            <span className="align-middle fw-bold">
              <Badge pill color="light-warning" className="me-1">
                DK-1234-AB
              </Badge>
            </span>
          </td>
          <td>
            <Badge pill color="light-success" className="me-1">
              DK-1234-AB
            </Badge>
            PIC: TES
          </td>
          <td>
            <Badge pill color="light-info" className="me-1">
              DK-1234-AB
            </Badge>
            PIC: TEK1
          </td>
          <td>
            <Badge pill color="light-primary" className="me-1">
              DK-1234-AB
            </Badge>
            PIC: KASIR1
          </td>
          <td>
            <Row>
              <Col sm="12">
                <Button color="primary" outline>
                  Prev
                </Button>

                <Button color="primary" outline>
                  Next
                </Button>
              </Col>
            </Row>
          </td>
        </tr>
      </tbody>
    </Table>
  )
}

export default Progress
