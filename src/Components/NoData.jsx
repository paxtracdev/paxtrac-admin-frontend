import React from 'react';
import noDataSvg from "../assets/images/nodataImage.png";
 

const NoData= ({ 
  text = "No data found", 
  image = noDataSvg, 
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
      <p className="text-muted mt-3">{text}</p>
    </div>
  );
};

export default NoData;