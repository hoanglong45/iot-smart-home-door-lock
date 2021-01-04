import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { auth } from "../../services/firebase";
import "./style.scss";
import { useHistory } from "react-router-dom";

const Login = (props) => {
  const [error, setError] = useState("");
  const history = useHistory();
  const { setIsLogin } = props;
  const handleSignIn = (email, password) => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(async (res) => {
        const token = await Object.entries(res.user)[5][1].b.h;
        if (token) {
          setIsLogin(true);
          localStorage.setItem("token", token);
          return history.push("/dashboard/access-log");
        }
      })
      .catch(() => {
        setError("Email or password incorrect !");
      });
  };
  const onFinish = (values) => {
    const { email, password } = values;
    handleSignIn(email, password);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed", errorInfo);
  };

  return (
    <div className="container-form">
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        className="form"
      >
        <h1>login</h1>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>

        {error && <Form.Item className="error">{error}</Form.Item>}
      </Form>
    </div>
  );
};

export default Login;
