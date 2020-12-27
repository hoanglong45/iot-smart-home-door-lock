import React, { useState } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { Layout, Menu } from "antd";
import "./App.css";
import { UserOutlined, DashboardOutlined } from "@ant-design/icons";
import AccessLog from "./components/AccessLog";
import EditableTable from "./components/EditableTable";

const { Header, Content, Footer, Sider } = Layout;

export default function App() {
  const [collapsed, setCollapse] = useState(false);
  function toggle() {
    setCollapse(!collapsed);
  }

  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider collapsible collapsed={collapsed} onCollapse={toggle}>
          <div className="logo" />
          <Menu
            theme="dark"
            defaultSelectedKeys={["/access-log"]}
            mode="inline"
          >
            <Menu.Item key="/access-log" icon={<DashboardOutlined />}>
              Access Log
              <Link to="/access-log" />
            </Menu.Item>
            <Menu.Item key="/user-info" icon={<UserOutlined />}>
              User Information
              <Link to="/user-info" />
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} />
          <Content style={{ margin: "0 16px" }}>
            <Switch>
              <Route exact path="/user-info" component={EditableTable} />
              <Route exact path="/access-log" component={AccessLog} />
            </Switch>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Dashboard ©2020 Created by Long Le Hoang
          </Footer>
        </Layout>
      </Layout>
    </Router>
  );
}
