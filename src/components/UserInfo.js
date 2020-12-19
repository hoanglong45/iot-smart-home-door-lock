import React from "react";
import { Table } from "antd";
import { db } from "../services/firebase";
import AddUser from "./AddUser";

class UserInfo extends React.Component {
  state = {
    users: [],
    // quantities: 1,
    // isLoadMore: false,
    readError: null,
  };

  componentDidMount() {
    // const { quantities } = this.state;
    const itemsRef = db.ref("Users");
    itemsRef.on("value", (snapshot) => {
      let userData = snapshot.val();
      let newArrUser = [];
      for (let user in userData) {
        newArrUser.push({
          id: user,
          name: userData[user].name,
          rfid: userData[user].rfid,
          pin: userData[user].pin,
          createdDate: userData[user].created_by_date,
          createdTime: userData[user].created_by_time,
        });
      }
      this.setState({
        users: newArrUser,
      });
    });
  }

  // handleLoadMore = () => {
  //   let { quantities, isLoadMore } = this.state;
  //   this.setState({ quantities: (quantities += 2), isLoadMore: true });
  // };

  // componentDidUpdate() {
  //   let { isLoadMore, quantities } = this.state;
  //   if (isLoadMore) {
  //     console.log("run update");
  //     const itemsRef = db.ref("Users");
  //     itemsRef.limitToFirst(quantities).on("value", (snapshot) => {
  //       let firstData = snapshot.val();
  //       console.log("firstData", firstData);
  //       // first data có 3 người
  //       let newArrUser = [];
  //       // tạo 1 mảng rỗng

  //       // lặp qua data ban đầu ( người )
  //       for (let user in firstData) {
  //         // sau đó lấy hết info của người đó , push vào mảng rỗng
  //         newArrUser.push({
  //           id: firstData,
  //           name: firstData[user].name,
  //           rfid: firstData[user].rfid,
  //           pin: firstData[user].pin,
  //           createdDate: firstData[user].created_by_date,
  //           createdTime: firstData[user].created_by_time,
  //         });
  //       }
  //       this.setState({
  //         users: newArrUser,
  //         isLoadMore: false,
  //       });
  //     });
  //   }
  // }

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
        title: "Pin",
        dataIndex: "pin",
      },
      {
        title: "Created by Date",
        dataIndex: "createdDate",
      },
      {
        title: "Created by Time",
        dataIndex: "createdTime",
      },
    ];

    return (
      <div>
        <AddUser />
        <Table dataSource={users} columns={columns} rowKey="id" />
      </div>
    );
  }
}

export default UserInfo;
