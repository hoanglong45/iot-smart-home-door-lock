import React, { useEffect } from "react";
const CameraComponent = ({ rfid, srcImage, setSrcImage }) => {
  useEffect(() => {
    async function getImageUser(rfidUser) {
      await fetch(
        `http://localhost:5000/api/capture/${rfidUser}/starting`
      ).then((res) => {
        setSrcImage((prevState) => (prevState = res.url));
      });
    }
    if (!srcImage) {
      getImageUser(rfid);
    }
  });

  return (
    <div className="container-camera-component">
      <img src={srcImage} alt="test" style={{ width: "100%" }} />
    </div>
  );
};

export default CameraComponent;
