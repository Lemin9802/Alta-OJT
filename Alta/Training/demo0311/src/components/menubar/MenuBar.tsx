import React from 'react';
import {
  Layout,
  Menu,
  Button,
} from 'antd';
import type { MenuProps} from 'antd';
import {
  DashboardOutlined,
  DesktopOutlined,
  MessageOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

import './MenuBar.css';

const {Sider} = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const menuItems: MenuItem[] = [
  getItem('Dashboard', '1', <DashboardOutlined />),
  getItem('Thiết bị', '2', <DesktopOutlined />),
  getItem('Dịch vụ', '3', <MessageOutlined />),
  getItem('Cấp số', '4', <FileTextOutlined />),
  getItem('Báo cáo', '5', <FileTextOutlined />),
  getItem('Cài đặt hệ thống', '6', <SettingOutlined />),
];

const MenuBar: React.FC = () => {
  
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#F6F6F6' }}>
      <Sider width={200} className="sider-custom">
        <div className="logo">
          <img src={`${process.env.PUBLIC_URL}/images/alta-logo.png`} alt="Alta Media" />
        </div>
        <Menu
          mode="vertical"
          defaultSelectedKeys={['2']}
          items={menuItems}
          className="sider-menu"
        />
        <Button className="logout-button" icon={<LogoutOutlined />} 
        onClick={()=>{
          localStorage.clear();
          window.location.reload();
          }
        }>
          Đăng xuất
        </Button>
      </Sider>
    </Layout>
  );
};

export default MenuBar;