import React, { useState } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

import { Layout, Menu } from "antd";
import "./App.css";
import {
  UserOutlined,
  DashboardOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import AccessLog from "./components/AccessLog";
import EditableTable from "./components/EditableTable";
import Login from "./components/Login/index";
import { auth } from "./services/firebase";

const { Header, Content, Footer, Sider } = Layout;

const App = () => {
  const [collapsed, setCollapse] = useState(false);
  const [isLogin, setIsLogin] = useState(() => {
    const isHaveToken = localStorage.getItem("token");
    if (isHaveToken) {
      return true;
    }
    return false;
  });
  function toggle() {
    setCollapse(!collapsed);
  }

  function logout() {
    auth.signOut().then(() => {
      localStorage.removeItem("token");
      setIsLogin(false);
    });
    window.location.replace("/dashboard/");
  }

  return (
    <Router>
      {isLogin ? (
        <Layout style={{ minHeight: "100vh" }}>
          <Sider collapsible collapsed={collapsed} onCollapse={toggle}>
            <div className="logo" />
            <Menu
              theme="dark"
              defaultSelectedKeys={["/dashboard/access-log"]}
              mode="inline"
            >
              <Menu.Item key="/access-log" icon={<DashboardOutlined />}>
                Access Log
                <Link to="/dashboard/access-log" />
              </Menu.Item>
              <Menu.Item key="/user-info" icon={<UserOutlined />}>
                User Information
                <Link to="/dashboard/user-info" />
              </Menu.Item>
              <div className="button-logout"></div>
              <Menu.Item icon={<LogoutOutlined />}>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    width: "calc(100% - 32px)",
                    padding: "0",
                    textAlign: "left",
                  }}
                  onClick={logout}
                >
                  Logout
                </button>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }} />
            <Content style={{ margin: "0 16px" }}>
              <Switch>
                <Route exact path="/dashboard/user-info" component={EditableTable} />
                <Route exact path="/dashboard/access-log" component={AccessLog} />
              </Switch>
            </Content>
            <Footer style={{ textAlign: "center" }}>
              Dashboard ©2020 Created by Long Le Hoang
            </Footer>
          </Layout>
        </Layout>
      ) : (
        <Login setIsLogin={setIsLogin} />
      )}
    </Router>
  );
};

export default App;
