import React, { useState } from 'react';
import Charts from "react-apexcharts";
import { CardsData } from '../../Data/Data';

function Chart1() {
    const [state,setState]=useState({
        option:{
            chart:{
                id:"basic bar"
            },
            xaxis:{
                categories:[1991,1998,1996,2014,2022,1999,2000,2001,2004]
            }
        },

        series:[
            {
                name:"series1",
                data:[30,20,10,40,50,60,20,10,75]

            }
        ]
    })
    
  return (
        <div className='Chart1'>
            <Charts
                options={state.option}
                series={state.series}
                type="bar"
                width="600"
            />
        </div>
  )
}

export default Chart1