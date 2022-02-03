import { useContext } from 'react'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import { Row, Col } from 'reactstrap'

import '@styles/react/libs/charts/apex-charts.scss'

const AdminDashboard = () => {
  const { colors } = useContext(ThemeColors)

  return (
    <div id="dashboard-analytics">
      <Row className="match-height">
        <Col lg="6" sm="12"></Col>
      </Row>
    </div>
  )
}

export default AdminDashboard
