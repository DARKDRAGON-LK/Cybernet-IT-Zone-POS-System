import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Slider from "react-slick";
import "./Laptopslider.css";
import { sliderdata } from "./Sliderdata";

function Laptopslider() {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 3,
  };
  return (
    <div className="slider">
      <Slider {...settings}>
        {sliderdata.map((item) => (
          <div className="container">
            <div className="card">
                <div className="imagearea">

                </div>
                <div className="itemdata">
                    <p className="name">{item.itemName}</p>
                    <p className="code">{item.itemCode}</p>
                    <p className="price">{item.itemprice}</p>
                </div>
            </div> 
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default Laptopslider;
