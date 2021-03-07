import React, { useEffect, useState } from "react";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import "./styles.scss";

const CameraComponent = ({ setArrSrcImgReview }) => {
  const [isFirstTimeClick, setIsFirstTimeClick] = useState(false);
  const [count, setCount] = useState(1);

  useEffect(() => {
    const targetTrigger = document.getElementById("inner-circle");
    if (targetTrigger && isFirstTimeClick) {
      const counting = setTimeout(() => {
        if (count > 2) {
          return clearTimeout(counting);
        }
        targetTrigger.click();
        return setCount((prevCount) => prevCount + 1);
      }, 1000);
    }
  }, [isFirstTimeClick, count]);

  const handleTakePhoto = (dataUri) => {
    setIsFirstTimeClick(true);
    setArrSrcImgReview((prevArrSrc) => [...prevArrSrc, dataUri]);
  };
  return (
    <div className="container-camera-component">
      <Camera
        onTakePhoto={(dataUri) => {
          handleTakePhoto(dataUri);
        }}
      />
    </div>
  );
};

export default CameraComponent;
