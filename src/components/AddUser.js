import React, { useState } from "react";
import { Form, Input, Button, Modal, message } from "antd";
import { db } from "../services/firebase";

const AddUser = (props) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const { arrUsers } = props;

  const showModal = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
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

  const onFinish = (values) => {
    const itemsRef = db.ref("Users");
    const { name, rfid, pin } = values;
    const createdDate = new Date().toLocaleDateString();
    const createdTime = new Date().toLocaleTimeString();
    if (!checkRFID(rfid)) {
      const item = {
        name: name,
        rfid: rfid,
        pin: pin,
        created_by_date: createdDate,
        created_by_time: createdTime,
      };
      itemsRef.push(item);
      setModalVisible(false);
      onReset();
    } else {
      message.error("RFID existed !");
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
        <Form
          form={form}
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
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
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <Button type="primary" onClick={showModal}>
        Add User
      </Button>
    </>
  );
};

export default AddUser;
