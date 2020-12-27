import React from "react";
import { Table } from "antd";
import { db } from "../services/firebase";

class AccessLog extends React.Component {
  state = {
    users: [],
  };

  componentDidMount() {
    const itemsRef = db.ref("Access");
    itemsRef.on("value", (snapshot) => {
      let userData = snapshot.val();
      let newArrUser = [];
      for (let user in userData) {
        newArrUser.unshift({
          id: user,
          name: userData[user].name,
          rfid: userData[user].rfid,
          accessDate: userData[user].access_by_date,
          accessTime: userData[user].access_by_time,
        });
      }
      this.setState({
        users: newArrUser,
      });
    });
  }

  render() {
    const { users } = this.state;
    const columns = [
      {
        title: "Name",
        dataIndex: "name",
      },
      {
        title: "RFID",
        dataIndex: "rfid",
      },
      {
        title: "Access by Date",
        dataIndex: "accessDate",
      },
      {
        title: "Access by Time",
        dataIndex: "accessTime",
      },
    ];

    return (
      <div>
        <Table dataSource={users} columns={columns} rowKey="id" />
      </div>
    );
  }
}

export default AccessLog;
