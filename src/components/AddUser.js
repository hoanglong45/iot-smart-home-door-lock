import React, { useState, Component } from "react";
import { Form, Input, Button, Modal, message } from "antd";
import { db } from "../services/firebase";

const AddUser = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setModalVisible(true);
  };

  const handleOk = () => {
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFinish = (values) => {
    const itemsRef = db.ref("Users");
    const { name, rfid, pin } = values;
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
    setModalVisible(false);
    onReset();
    console.log("values", values);
  };

  return (
    <>
      <Modal
        title="Add new user"
        visible={isModalVisible}
        onOk={handleOk}
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
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Pin"
            name="pin"
            rules={[
              {
                required: true,
                message: "Please input your pin",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
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
