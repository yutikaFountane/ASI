import React from 'react';
import { Button, Tooltip, Dropdown, Menu, Input, Avatar } from 'antd';
import {
  AuditOutlined,
  CalendarOutlined,
  FileUnknownOutlined,
  DownOutlined,
} from '@ant-design/icons';
import './HeaderBar.css';

const { Search } = Input;

const NewReservationMenu = (
  <Menu>
    <Menu.Item key="room">Create Room Reservation</Menu.Item>
    <Menu.Item key="space">Create Space Reservation</Menu.Item>
  </Menu>
);

const ProfileMenu = (
  <Menu>
    <Menu.Item key="profile">Profile</Menu.Item>
    <Menu.Item key="logout">Logout</Menu.Item>
  </Menu>
)

const HeaderBar: React.FC = () => {
  return (
    <div className="header-bar">
      <div className="header-bar-search">
        <Search
          placeholder="Search..."
          enterButton
        />
      </div>
      <div className="header-bar-actions">
        <Tooltip title="Audit">
          <Button type="default" icon={<AuditOutlined />} />
        </Tooltip>
        <Tooltip title="Calendar">
          <Button type="default" icon={<CalendarOutlined />} />
        </Tooltip>
        <Tooltip title="Unposted Reservations">
          <Button type="default" icon={<FileUnknownOutlined />} />
        </Tooltip>
        <Dropdown overlay={NewReservationMenu} placement="bottomRight" trigger={['click']}>
          <Tooltip title="New Reservation">
            <Button type="primary" icon={<CalendarOutlined />} />
          </Tooltip>
        </Dropdown>
        <div className="header-divider" />
        <Dropdown overlay={ProfileMenu} placement="bottomRight" trigger={['click']}>
           <div className="profile-section">
              <Avatar 
                size={32} 
                src="/logo192.png" 
                style={{ borderRadius: 6 }}
              />
              <DownOutlined style={{ marginLeft: 8 }} />
           </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default HeaderBar; 