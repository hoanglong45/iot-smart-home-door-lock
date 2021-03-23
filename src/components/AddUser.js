import React, { useState } from "react";
import { Form, Input, Button, Modal, message } from "antd";
import { db } from "../services/firebase";
import CameraComponent from "./Camera";

const styleBlockBtnAction = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const AddUser = (props) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState(null);
  const [srcImage, setSrcImage] = useState("");
  const [form] = Form.useForm();
  const { arrUsers } = props;
  const showModal = () => {
    setStep(1);
    onReset();
    setModalVisible(true);
  };

  const handleCancel = () => {
    fetch(`http://localhost:5000/api/capture/${profile.rfid}/cancel`);
    setStep(1);
    onReset();
    setSrcImage("");
    setProfile(null);
    setModalVisible(false);
  };

  const onReset = () => {
    form.resetFields();
  };

  const checkRFID = (rfid) => {
    for (let user in arrUsers) {
      if (rfid === arrUsers[user].rfid) {
        return true;
      }
    }
    return false;
  };

  const handleNextStep = (values) => {
    const { rfid } = values;
    if (rfid && !checkRFID(rfid)) {
      setProfile(values);
      setStep(step + 1);
    } else {
      message.error("RFID existed !");
    }
  };

  const handleSubmitProfile = () => {
    const itemsRef = db.ref("Users");
    const { name, rfid, pin } = profile;
    const createdDate = new Date().toLocaleDateString();
    const createdTime = new Date().toLocaleTimeString();
    const item = {
      name: name,
      rfid: rfid,
      pin: pin,
      created_by_date: createdDate,
      created_by_time: createdTime,
    };
    itemsRef.push(item);
    try {
      fetch(`http://localhost:5000/api/training`).then((res) =>
        console.log("res", res)
      );
    } catch (err) {
      console.log("err", err);
    } finally {
      setModalVisible(false);
      setSrcImage("");
      setProfile(null);
      onReset();
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleRenderContent = (stepProcess) => {
    switch (stepProcess) {
      case 1: {
        return (
          <Form
            form={form}
            name="basic"
            initialValues={{
              remember: true,
            }}
            onFinish={handleNextStep}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Please input your name",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="RFID"
              name="rfid"
              rules={[
                {
                  required: true,
                  message: "Please input your RFID",
                  pattern: /^[0-9]+$/,
                },
              ]}
            >
              <Input.Password type="number" />
            </Form.Item>

            <Form.Item
              label="Pin"
              name="pin"
              rules={[
                {
                  required: true,
                  message: "Please input your pin",
                  pattern: /^[0-9]+$/,
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Next step
              </Button>
            </Form.Item>
          </Form>
        );
      }
      case 2: {
        return (
          <>
            {profile && (
              <CameraComponent
                rfid={profile.rfid}
                srcImage={srcImage}
                setSrcImage={setSrcImage}
              />
            )}
          </>
        );
      }
      default:
        return null;
    }
  };

  return (
    <>
      <Modal
        title="Add new user"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={false}
      >
        {handleRenderContent(step)}
        {step > 1 && (
          <div style={styleBlockBtnAction}>
            <Button type="primary" onClick={handlePrevStep}>
              Prev step
            </Button>
            <Button type="primary" onClick={handleSubmitProfile}>
              Submit
            </Button>
          </div>
        )}
      </Modal>
      <Button type="primary" onClick={showModal}>
        Add User
      </Button>
    </>
  );
};

export default AddUser;
