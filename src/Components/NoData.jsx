import React from 'react';
import noDataImgbg from "../assets/images/noDataImgbg.png";

const NoData= ({ 
  text = "No data found", 
  image = noDataImgbg, 
  imageWidth = 250, 
  className = "",
  showImage = true 
}) => {
  return (
    <div className={`text-center py-4 ${className}`}>
      {showImage && (
        <img 
          width={imageWidth} 
          src={image} 
          alt="no-data-found" 
          className=""
        />
      )}
      <p className="text-muted">{text}</p>
    </div>
  );
};

export default NoData;