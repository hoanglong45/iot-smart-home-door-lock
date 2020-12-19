import React from "react";
import { Table } from "antd";
import { db } from "../services/firebase";

// const dataSource = [
//   {
//     key: "1",
//     name: "Mike",
//     date: "12/12/2020",
//     time: "15:00:26",
//   },
//   {
//     key: "2",
//     name: "John",
//     date: "12/12/2020",
//     time: "15:00:26",
//   },
//   {
//     key: "3",
//     name: "Long",
//     date: "12/12/2020",
//     time: "15:00:26",
//   },
//   {
//     key: "4",
//     name: "Thanh",
//     date: "12/12/2020",
//     time: "15:00:26",
//   },
//   {
//     key: "5",
//     name: "Van",
//     date: "12/12/2020",
//     time: "15:00:26",
//   },
// ];

// const columns = [
//   {
//     title: "Name",
//     dataIndex: "name",
//     key: "name",
//   },
//   {
//     title: "Date",
//     dataIndex: "date",
//     key: "date",
//   },
//   {
//     title: "Time",
//     dataIndex: "time",
//     key: "time",
//   },
// ];

class AccessLog extends React.Component {
  constructor() {
    super();
    this.state = {
      name: "",
      rfid: "",
      pin: "",
      items: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = db.ref("Users");
    const createdDate = new Date().toLocaleDateString();
    const createdTime = new Date().toLocaleTimeString();
    const item = {
      name: this.state.name,
      rfid: this.state.rfid,
      pin: this.state.pin,
      created_by_date: createdDate,
      created_by_time: createdTime,
    };
    itemsRef.push(item);
    this.setState({
      name: "",
      rfid: "",
      pin: "",
    });
  }
  componentDidMount() {
    const itemsRef = db.ref("Users");
    itemsRef.on("value", (snapshot) => {
      let firstData = snapshot.val();
      let newArrUser = [];
      for (let user in firstData) {
        newArrUser.push({
          id: firstData,
          name: firstData[user].name,
          rfid: firstData[user].rfid,
          pin: firstData[user].pin,
          createdDate: firstData[user].created_by_date,
          createdTime: firstData[user].created_by_time,
        });
      }
      this.setState({
        items: newArrUser,
      });
    });
  }
  removeItem(itemId) {
    const itemRef = db.ref(`/Users/${itemId}`);
    itemRef.remove();
  }
  render() {
    return (
      <div className="app">
        <header>
          <div className="wrapper">
            <h1>Fun Food Friends</h1>
          </div>
        </header>
        <div className="container">
          <section className="add-item">
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                onChange={this.handleChange}
                value={this.state.name}
              />
              <input
                type="text"
                name="rfid"
                placeholder="rfid"
                onChange={this.handleChange}
                value={this.state.rfid}
              />
              <input
                type="text"
                name="pin"
                placeholder="pin"
                onChange={this.handleChange}
                value={this.state.pin}
              />
              <button>Add Item</button>
            </form>
          </section>
          <section className="display-item">
            <div className="wrapper">
              <ul>
                {this.state.items.map((item) => {
                  return (
                    <li key={item.id}>
                      <h3>{item.title}</h3>
                      <p>
                        {item.name}
                        {item.pin}
                        {item.rfid}
                        {item.createdDate}
                        {item.createdTime}
                        <button onClick={() => this.removeItem(item.id)}>
                          Remove Item
                        </button>
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default AccessLog;
