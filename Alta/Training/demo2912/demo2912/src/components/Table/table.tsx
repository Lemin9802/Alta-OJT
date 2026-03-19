import React, { useEffect, useState } from 'react';
import { Table as AntTable, Popover, Carousel, Spin, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import './table.css';

const { Text, Link } = Typography;

type PurchaseDetail = {
	key: number;
	id: number;
	orderId: number;
	materialId: number;
	quantity: number;
	price: number;
	materialName: string;
};

type PurchaseOrder = {
	key: number;
	orderId: number;
	userId: number;
	userFullName: string;
	orderNumber: string;
	orderDate: string;
	supplierName: string;
	purchaseCode?: string;
	projectCode?: string;
	purchaseDetails: PurchaseDetail[];
	isUploaded?: boolean;
};

const Table = () => {
	const [data, setData] = useState<PurchaseOrder[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const res = await fetch(
					'http://192.168.80.101:5126/api/PurchaseOrder/1105?pageNumber=1&pageSize=5'
				);
				const json = await res.json();
				const normalized: PurchaseOrder[] = (json || []).map((item: any) => ({
					...item,
				}));
				setData(normalized);
			} catch (err) {
				console.error('Failed to fetch purchase orders', err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	const columns: ColumnsType<PurchaseOrder> = [
		{
			title: 'Mã dự án',
			dataIndex: 'projectCode',
			key: 'projectCode',
			width: 120,
			render: (text) => <Text>{text}</Text>,
		},
		{
			title: 'Số phiếu mua hàng',
			dataIndex: 'purchaseCode',
			key: 'purchaseCode',
			width: 160,
			render: (text) => <Text>{text}</Text>,
		},
		{
			title: 'Số đơn hàng',
			dataIndex: 'orderNumber',
			key: 'orderNumber',
			width: 160,
			render: (_text: string, record: PurchaseOrder) => {
				const details = record.purchaseDetails || [];
				const content = (
					<div className="popover-carousel">
						{details.length === 0 ? (
							<div className="carousel-slide">Không có chi tiết</div>
						) : (
							<Carousel dots={{ className: 'carousel-dots' }}>
								{details.map((d) => (
									<div key={d.key} className="carousel-slide">
										<div className="material-name">{d.materialName}</div>
										<div className="material-meta">Số lượng: {d.quantity}</div>
										<div className="material-meta">
											Giá: {d.price?.toLocaleString('vi-VN')}
										</div>
									</div>
								))}
							</Carousel>
						)}
					</div>
				);

				return (
					<Popover content={content} trigger="hover" placement="right">
						<Link className="order-link">{record.orderNumber}</Link>
					</Popover>
				);
			},
		},
		{
			title: 'Ngày đơn hàng',
			dataIndex: 'orderDate',
			key: 'orderDate',
			width: 140,
			render: (text: string) =>
				text ? new Date(text).toLocaleDateString('vi-VN') : '-',
		},
		{
			title: 'Tổng tiền',
			dataIndex: 'purchaseDetails',
			key: 'totalMoney',
			width: 120,
			render: (details: PurchaseDetail[]) => {
				if (!details || details.length === 0) return '-';
				const total = details.reduce(
					(s, d) => s + (d.quantity || 0) * (d.price || 0),
					0
				);
				return <Text type="danger">{total.toLocaleString('vi-VN')}</Text>;
			},
		},
		{
			title: 'Người tạo phiếu',
			dataIndex: 'userFullName',
			key: 'userFullName',
			width: 180,
		},
		{
			title: 'Nhà cung cấp',
			dataIndex: 'supplierName',
			key: 'supplierName',
			render: (text) => <span className="supplier-name">{text}</span>,
		},
	];

	return (
		<div className="purchase-table">
            {loading ? (
            <div className="table-loading"><Spin /></div>
            ) : (
			<AntTable<PurchaseOrder>
				rowKey={(record: PurchaseOrder) => String(record.key)}
				dataSource={data as PurchaseOrder[]}
				columns={columns as any} 
				pagination={{ pageSize: 10 }}
				rowSelection={{}}
			/>
            )}
        </div>
	);
}
export default Table;






