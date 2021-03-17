import React, { useEffect, useState } from "react";

const CameraComponent = ({ rfid }) => {
  const [srcImage, setSrcImage] = useState("");
  useEffect(() => {
    async function getImageUser(rfidUser) {
      const res = await fetch(`http://localhost:5000/api/capture/${rfidUser}`);
      console.log("res", res);
      setSrcImage((prevState) => (prevState = res.url));
    }
    getImageUser(rfid);
  }, []);
  return (
    <div className="container-camera-component">
      <img src={srcImage} alt="test" style={{ width: "100%" }} />
    </div>
  );
};

export default CameraComponent;
