import React, { useState, useEffect } from 'react';
import "./DateTime.css"

function DateTime() {
  const [dateState, setDateState] = useState(new Date());
  useEffect(() => {
         setInterval(() => setDateState(new Date()), 1000);
  }, []);

  return (
    <div className='Datetime'>
        <div className='date'>{' '}
              {dateState.toLocaleDateString('en-GB', {
                 weekday:'long',
                 day: 'numeric',
                 month: 'long',
                 year: 'numeric',
              })}</div>
        <div className='time'>{dateState.toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                second : 'numeric',
                hour12: true,
            })}</div>
    </div>
  )
}

export default DateTime