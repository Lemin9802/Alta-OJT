import React, { useEffect, useMemo, useState } from 'react';
import './styles.css';
import {
  Layout,
  Menu,
  Breadcrumb,
  Typography,
  Select,
  Input,
  Table,
  Badge,
  Button,
  Avatar,
  Space,
  Flex,
  Alert,
} from 'antd';
import type { MenuProps, TableProps } from 'antd';
import {
  DashboardOutlined,
  DesktopOutlined,
  MessageOutlined,
  FileTextOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  PlusOutlined,
  SearchOutlined,
  RightOutlined,
  LeftOutlined,
} from '@ant-design/icons';
import {
  ActivityStatus,
  ConnectionStatus,
  DeviceItem,
  addDevice,
  fetchDevices,
  selectDevices,
  selectDevicesError,
  selectDevicesLoading,
} from '../../store/deviceSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

type MenuItem = Required<MenuProps>['items'][number];
type ActivityFilter = 'all' | 'active' | 'inactive';
type ConnectionFilter = 'all' | 'connected' | 'disconnected';

type DeviceForm = {
  code: string;
  name: string;
  ip: string;
  activityStatus: ActivityStatus;
  connectionStatus: ConnectionStatus;
  services: string;
};

const activityLabels: Record<ActivityStatus, string> = {
  active: 'Hoạt động',
  inactive: 'Ngưng hoạt động',
};

const connectionLabels: Record<ConnectionStatus, string> = {
  connected: 'Kết nối',
  disconnected: 'Mất kết nối',
};

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

const initialForm: DeviceForm = {
  code: '',
  name: '',
  ip: '',
  activityStatus: 'active',
  connectionStatus: 'connected',
  services: '',
};

const Device: React.FC = () => {
  const dispatch = useAppDispatch();
  const devices = useAppSelector(selectDevices);
  const loading = useAppSelector(selectDevicesLoading);
  const error = useAppSelector(selectDevicesError);

  const [activityFilter, setActivityFilter] = useState<ActivityFilter>('all');
  const [connectionFilter, setConnectionFilter] = useState<ConnectionFilter>('all');
  const [keyword, setKeyword] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [form, setForm] = useState<DeviceForm>(initialForm);
  const [formError, setFormError] = useState<string | undefined>(undefined);

  const pageSize = 2;

  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  useEffect(() => {
    setPage(1);
  }, [activityFilter, connectionFilter, keyword]);

  const filteredData = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return devices.filter((device) => {
      const matchesActivity =
        activityFilter === 'all' ? true : device.activityStatus === activityFilter;
      const matchesConnection =
        connectionFilter === 'all' ? true : device.connectionStatus === connectionFilter;
      const matchesKeyword =
        normalizedKeyword.length === 0
          ? true
          : `${device.code} ${device.name} ${device.ip} ${device.services.join(' ')}`
              .toLowerCase()
              .includes(normalizedKeyword);

      return matchesActivity && matchesConnection && matchesKeyword;
    });
  }, [devices, activityFilter, connectionFilter, keyword]);

  const paginatedData = useMemo(
    () => filteredData.slice((page - 1) * pageSize, page * pageSize),
    [filteredData, page, pageSize],
  );

  const columns: TableProps<DeviceItem>['columns'] = [
    { title: 'Mã thiết bị', dataIndex: 'code', key: 'code' },
    { title: 'Tên thiết bị', dataIndex: 'name', key: 'name' },
    { title: 'Địa chỉ IP', dataIndex: 'ip', key: 'ip' },
    {
      title: 'Trạng thái hoạt động',
      dataIndex: 'activityStatus',
      key: 'activityStatus',
      render: (value: DeviceItem['activityStatus'], record) => (
        <Badge
          status={value === 'active' ? 'success' : 'error'}
          text={record.activityLabel || activityLabels[value] || value}
        />
      ),
    },
    {
      title: 'Trạng thái kết nối',
      dataIndex: 'connectionStatus',
      key: 'connectionStatus',
      render: (value: DeviceItem['connectionStatus'], record) => (
        <Badge
          status={value === 'connected' ? 'success' : 'error'}
          text={record.connectionLabel || connectionLabels[value] || value}
        />
      ),
    },
    {
      title: 'Dịch vụ sử dụng',
      dataIndex: 'services',
      key: 'services',
      render: (services: string[]) => (
        <div>
          {services.join(', ')}
          <br />
          <a href="services.tsx">Xem thêm</a>
        </div>
      ),
      width: 250,
    },
    {
      title: '',
      key: 'actionDetail',
      render: () => <a href="service_detail.tsx">Chi tiết</a>,
    },
    {
      title: '',
      key: 'actionUpdate',
      render: () => <a href="service_update.tsx">Cập nhật</a>,
    },
  ];

  const handleFormChange = (field: keyof DeviceForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddDevice = () => {
    setForm(initialForm);
    setFormError(undefined);
    setIsAdding(true);
  };

  const handleSubmit = () => {
    if (!form.code.trim() || !form.name.trim() || !form.ip.trim()) {
      setFormError('Vui lòng điền đầy đủ các trường bắt buộc.');
      return;
    }

    const servicesArray = form.services
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const nextId = Math.max(0, ...devices.map((d) => d.id || 0)) + 1;
    const newDevice: DeviceItem = {
      id: nextId,
      code: form.code.trim(),
      name: form.name.trim(),
      ip: form.ip.trim(),
      activityStatus: form.activityStatus,
      connectionStatus: form.connectionStatus,
      activityLabel: activityLabels[form.activityStatus],
      connectionLabel: connectionLabels[form.connectionStatus],
      services: servicesArray,
    };

    dispatch(addDevice(newDevice));
    setIsAdding(false);
    setForm(initialForm);
    setFormError(undefined);
    setPage(1);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setForm(initialForm);
    setFormError(undefined);
  };

  useEffect(() => {
    const item: {id:number, name: string} = {id:1, name:"kiwi"};
    async function LogData(){
      console.log(item);
      return new Promise((resolve:any) => {
        resolve('banana')
    })
  }
  let myitem:Promise<any> = LogData();
  myitem.then((value:any) => {
    item.name = value;
    console.log(item);
  });
  }, []);
    


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
        <Button
          className="logout-button"
          icon={<LogoutOutlined />}
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
        >
          
        </Button>
      </Sider>

      <Layout>
        <Header className="header-custom">
          <Flex justify="space-between" align="center">
            <Breadcrumb separator={<RightOutlined style={{ fontSize: '12px', color: '#7E7D88' }} />}>
              <Breadcrumb.Item>Thiết bị</Breadcrumb.Item>
              <Breadcrumb.Item className="breadcrumb-active">
                {isAdding ? 'Thêm thiết bị' : 'Danh sách thiết bị'}
              </Breadcrumb.Item>
            </Breadcrumb>
            <Space size="large" align="center">
              <BellOutlined style={{ fontSize: '20px', color: '#FF9138' }} />
              <Space>
                <Avatar src="https://i.pravatar.cc/32" />
                <div>
                  <Text style={{ fontSize: '12px', color: '#7E7D88' }}>Xin chào</Text>
                  <br />
                  <Text strong>{localStorage.getItem('fullName')}</Text>
                </div>
              </Space>
            </Space>
          </Flex>
        </Header>

        <Content className="content-custom">
          <Title level={2} className="page-title">
            {isAdding ? 'Thêm thiết bị' : 'Danh sách thiết bị'}
          </Title>

          {isAdding ? (
            <div style={{ background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
              {formError && (
                <Alert
                  type="error"
                  message={formError}
                  showIcon
                  style={{ marginBottom: 16 }}
                />
              )}
              <Flex gap={32} wrap>
                <div style={{ flex: 1, minWidth: 320 }}>
                  <Text strong>Mã thiết bị</Text>
                  <Input
                    value={form.code}
                    onChange={(e) => handleFormChange('code', e.target.value)}
                    placeholder="Ví dụ: KIO_09"
                    style={{ marginBottom: 16 }}
                  />

                  <Text strong>Tên thiết bị</Text>
                  <Input
                    value={form.name}
                    onChange={(e) => handleFormChange('name', e.target.value)}
                    placeholder="Ví dụ: Kiosk 09"
                    style={{ marginBottom: 16 }}
                  />

                  <Text strong>Địa chỉ IP</Text>
                  <Input
                    value={form.ip}
                    onChange={(e) => handleFormChange('ip', e.target.value)}
                    placeholder="Ví dụ: 192.168.1.19"
                    style={{ marginBottom: 16 }}
                  />
                </div>

                <div style={{ flex: 1, minWidth: 320 }}>
                  <Text strong>Trạng thái hoạt động</Text>
                  <Select
                    value={form.activityStatus}
                    onChange={(val) => handleFormChange('activityStatus', val as ActivityStatus)}
                    style={{ width: '100%', marginBottom: 16 }}
                  >
                    <Option value="active">Hoạt động</Option>
                    <Option value="inactive">Ngưng hoạt động</Option>
                  </Select>

                  <Text strong>Trạng thái kết nối</Text>
                  <Select
                    value={form.connectionStatus}
                    onChange={(val) => handleFormChange('connectionStatus', val as ConnectionStatus)}
                    style={{ width: '100%', marginBottom: 16 }}
                  >
                    <Option value="connected">Kết nối</Option>
                    <Option value="disconnected">Mất kết nối</Option>
                  </Select>

                  <Text strong>Dịch vụ sử dụng (phân tách bằng dấu phẩy)</Text>
                  <Input.TextArea
                    value={form.services}
                    onChange={(e) => handleFormChange('services', e.target.value)}
                    placeholder="VD: Khám tim mạch"
                    rows={3}
                    style={{ marginBottom: 16 }}
                  />
                </div>
              </Flex>

              <Flex justify="flex-end" gap={12}>
                <Button onClick={handleCancel}>Hủy</Button>
                <Button type="primary" onClick={handleSubmit} icon={<PlusOutlined />}>Lưu thiết bị</Button>
              </Flex>
            </div>
          ) : (
            <>
              <Flex gap="large" align="flex-start">
                <div style={{ flex: 1 }}>
                  <Flex justify="space-between" align="flex-start" style={{ marginBottom: 16 }}>
                    <Space size="large">
                      <div>
                        <Text>Trạng thái hoạt động</Text>
                        <Select
                          value={activityFilter}
                          onChange={(value) => setActivityFilter(value as ActivityFilter)}
                          style={{ width: 300, display: 'block' }}
                        >
                          <Option value="all">Tất cả</Option>
                          <Option value="active">{activityLabels.active}</Option>
                          <Option value="inactive">{activityLabels.inactive}</Option>
                        </Select>
                      </div>

                      <div>
                        <Text>Trạng thái kết nối</Text>
                        <Select
                          value={connectionFilter}
                          onChange={(value) => setConnectionFilter(value as ConnectionFilter)}
                          style={{ width: 300, display: 'block' }}
                        >
                          <Option value="all">Tất cả</Option>
                          <Option value="connected">{connectionLabels.connected}</Option>
                          <Option value="disconnected">{connectionLabels.disconnected}</Option>
                        </Select>
                      </div>
                    </Space>

                    <div>
                      <Text>Tất cả</Text>
                      <Input
                        placeholder="Nhập từ khóa"
                        suffix={<SearchOutlined style={{ color: '#FF9138' }} />}
                        style={{ width: 400, display: 'block' }}
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onPressEnter={() => setPage(1)}
                      />
                    </div>
                  </Flex>

                  {error && (
                    <Alert
                      type="error"
                      message="Không thể tải danh sách thiết bị"
                      description={error}
                      showIcon
                      style={{ marginBottom: 16 }}
                    />
                  )}

                  <Table
                    columns={columns}
                    dataSource={paginatedData}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                      total: filteredData.length,
                      current: page,
                      pageSize,
                      showSizeChanger: false,
                      onChange: (nextPage) => setPage(nextPage),
                      itemRender: (current, type, originalElement) => {
                        if (type === 'prev') {
                          return <LeftOutlined />;
                        }
                        if (type === 'next') {
                          return <RightOutlined />;
                        }
                        return originalElement;
                      },
                    }}
                    className="device-table"
                  />
                </div>

                <Button className="add-device-button" onClick={handleAddDevice}>
                  <div className="add-icon-wrapper">
                    <PlusOutlined />
                  </div>
                  Thêm thiết bị
                </Button>
              </Flex>
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Device;
