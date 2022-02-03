import { Link } from 'react-router-dom'
import { Button } from 'reactstrap'
import { useSkin } from '@hooks/useSkin'

import '@styles/base/pages/page-misc.scss'

const Error = () => {
  const { skin } = useSkin()

  const illustration = skin === 'dark' ? 'error-dark.svg' : 'error.svg',
    source = require(`@src/assets/images/pages/${illustration}`).default
  return (
    <div className="misc-wrapper">
      <div className="misc-inner p-2 p-sm-3">
        <div className="w-100 text-center">
          <h2 className="mb-1">Page Not Found </h2>
          <p className="mb-2">Oops! 😖 Halaman yang anda cari tidak ditemukan.</p>
          <Button tag={Link} to="/" color="primary" className="btn-sm-block mb-2">
            Back to home
          </Button>
          <img className="img-fluid" src={source} alt="Not authorized page" />
        </div>
      </div>
    </div>
  )
}
export default Error
