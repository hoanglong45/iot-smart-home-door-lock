import React, { useState, useEffect } from "react";
import { Input, Popconfirm, Form, Space, Button, notification } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { db } from "../services/firebase";
import UserInfo from "./UserInfo";
import AddUser from "./AddUser";

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}! ${
                inputType === "number" ? "requirement number" : ""
              }`,
              pattern: inputType === "number" && /^[0-9]+$/,
            },
          ]}
        >
          <Input />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState("");
  const [editingKey, setEditingKey] = useState("");

  useEffect(() => {
    const itemsRef = db.ref("Users");
    itemsRef.on("value", (snapshot) => {
      let userData = snapshot.val();
      const newArrUser = [];
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
      setData(newArrUser);
    });
  }, []);

  const isEditing = (record) => record.id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      rfid: "",
      pin: "",
      ...record,
    });
    setEditingKey(record.id);
  };

  const cancel = () => {
    setEditingKey("");
  };

  const openNotification = (type) => {
    switch (type) {
      case "success":
        notification[type]({
          message: "Success",
          description: "Updated successfully",
        });
        break;
      case "error":
        notification[type]({
          message: "Error",
          description: "RFID existed !",
        });
        break;
      default:
        break;
    }
  };

  const save = async (id) => {
    // const dayUpdate = new Date().toLocaleDateString();
    // const timeUpdate = new Date().toLocaleTimeString();

    const itemTarget = db.ref(`Users/${id}`);

    const newData = [...data];

    const checkRFID = (rfid) => {
      for (let user in newData) {
        if (rfid === newData[user].rfid) {
          return true;
        }
      }
      return false;
    };

    try {
      const row = await form.validateFields();
      const index = newData.findIndex((item) => id === item.id);
      if (index > -1) {
        const item = newData[index];
        const { createdDate, createdTime } = item;

        if (checkRFID(row.rfid)) {
          openNotification("error");
        } else {
          openNotification("success");
          newData.splice(index, 1, { ...item, ...row });
          itemTarget.set({
            ...row,
            created_by_date: createdDate,
            created_by_time: createdTime,
          });
          setData(newData);
          setEditingKey("");
        }
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => node}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),

    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),

    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",

    onFilterDropdownVisibleChange: (visible) => visible,

    render: (text) => text,
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
  };

  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const columns = [
    {
      title: "name",
      dataIndex: "name",
      ...getColumnSearchProps("name"),
      editable: true,
    },
    {
      title: "rfid",
      dataIndex: "rfid",
      ...getColumnSearchProps("rfid"),
      editable: true,
    },
    {
      title: "pin",
      dataIndex: "pin",
      editable: true,
    },
    {
      title: "Created by Date",
      dataIndex: "createdDate",
    },
    {
      title: "Created by Time",
      dataIndex: "createdTime",
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <Space size="middle">
            <Button onClick={() => save(record.id)}>
              Save
              <SaveOutlined />
            </Button>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <Button>
                Cancel <CloseOutlined />
              </Button>
            </Popconfirm>
          </Space>
        ) : (
          <Space size="middle">
            <Button disabled={editingKey !== ""} onClick={() => edit(record)}>
              Edit
              <EditOutlined style={{ marginLeft: "5px" }} />
            </Button>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleRemove(record.id)}
            >
              <Button disabled={editingKey !== ""}>
                <span>Delete</span>
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const handleRemove = (userId) => {
    const itemRef = db.ref(`Users/${userId}`);
    itemRef.remove();
  };
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType:
          col.dataIndex === "rfid" || col.dataIndex === "pin"
            ? "number"
            : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <>
      <AddUser arrUsers={data} />
      <Form form={form} component={false}>
        <UserInfo
          users={data}
          editableCell={EditableCell}
          mergedColumns={mergedColumns}
          handleCancel={cancel}
        />
      </Form>
    </>
  );
};

export default EditableTable;
