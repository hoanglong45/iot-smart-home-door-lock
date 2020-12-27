import React from "react";
import { Table } from "antd";

class UserInfo extends React.Component {
  render() {
    const { users, editableCell, mergedColumns, handleCancel } = this.props;

    return (
      <div>
        <Table
          components={{
            body: {
              cell: editableCell,
            },
          }}
          bordered
          dataSource={users}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: handleCancel,
          }}
          rowKey="id"
        />
      </div>
    );
  }
}

export default UserInfo;
