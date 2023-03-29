import { Button } from '@material-ui/core';
import React from 'react'
    import Loader from '../Preloader/Loader';
const Error404 = () => {
  return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '1.2rem',alignContent:"center" }}>
            <div className="loderarea">
              <div className="preloader"><Loader />
                <p className="Hedding">It look likes this page doesnot exist...</p></div>
            </div>
          </div>
  )
}

export default Error404