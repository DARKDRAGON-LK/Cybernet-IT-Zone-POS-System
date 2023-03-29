import React from "react";
import "./Itempopup.css";

function Itempopup(props) {
  return (
    <div className="mainContainer">
         <div className="clsButnContainer">
          <div className="close" onClick={()=>{
            
          }}>
            <p>X</p>
          </div>
        </div>
      <div className="frame">
        <div className="itemimage"></div>
        <div className="itemdetails">
          <p>{props.dataName}</p>
          <p>{props.dataCode}</p>
          <p>{props.dataIndex}</p>
        </div>
      </div>
    </div>
  );
}

export default Itempopup;
