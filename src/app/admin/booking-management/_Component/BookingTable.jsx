"use client";

import { Input, Table, Tag, Button, Modal, Select } from "antd";
import { Tooltip } from "antd";
import { ConfigProvider } from "antd";
import { Search, Trash, Eye } from "lucide-react";
import { useState } from "react";
import CustomConfirm from "@/components/CustomConfirm/CustomConfirm";
import {
  useDeleteBookingMutation,
  useGetBookingsQuery,
} from "@/redux/api/bookingApi";
import toast from "react-hot-toast";

export default function BookingTable({ limit }) {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasInterest, setHasInterest] = useState(undefined); // undefined = all, true/false = filter
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const { data: bookingData, isLoading } = useGetBookingsQuery({
    limit: limit || 10,
    page: currentPage,
    searchTerm: searchText,
    ...(hasInterest !== undefined && { hasInterest }),
  });

  const [deleteBooking, { isLoading: deleteLoading }] =
    useDeleteBookingMutation();

  const bookings = bookingData?.data || [];

  // Map API data correctly
  const data = bookings.map((booking, i) => ({
    key: booking._id || i,
    id: booking._id,
    customer_name: booking?.name || "N/A",
    service_id: booking?.service || "N/A",
    customer_email: booking?.email || "N/A",
    date: booking?.date || "N/A",
    comments: booking?.comments || "No comments",
    hasInterest: booking?.hasInterest ?? false,
    createdAt: booking?.createdAt,
  }));

  // Delete booking handler
  const handleDelete = async (id) => {
    try {
      const result = await deleteBooking(id).unwrap();
      if (result.success) {
        toast.success("Booking deleted successfully");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete booking");
    }
  };

  // Open view modal
  const handleView = (record) => {
    setSelectedBooking(record);
    setViewModalOpen(true);
  };

  // Table columns
  const columns = [
    {
      title: "Customer Name",
      dataIndex: "customer_name",
      render: (value) => (
        <span className="font-medium text-gray-800">{value}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "customer_email",
      render: (value) => <span className="text-gray-600">{value}</span>,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (value) => <span className="text-gray-700">{value}</span>,
      width: 220,
    },
    {
      title: "Interest",
      dataIndex: "hasInterest",
      render: (value) =>
        value ? (
          <Tag color="green">Interested</Tag>
        ) : (
          <Tag color="default">Not Interested</Tag>
        ),
      width: 130,
      align: "center",
    },
    {
      title: "Comments",
      dataIndex: "comments",
      render: (value) => (
        <span className="line-clamp-1 block max-w-[220px] text-gray-600">
          {value}
        </span>
      ),
      ellipsis: true,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <div className="flex items-center justify-center gap-2">
          {/* View Comments */}
          <Tooltip title="View Comments">
            <Button
              type="text"
              shape="circle"
              icon={<Eye size={16} className="text-blue-600" />}
              onClick={() => handleView(record)}
            />
          </Tooltip>

          {/* Delete */}
          <Tooltip title="Delete Booking">
            <CustomConfirm
              title="Are you sure to delete this booking?"
              description="This action cannot be undone."
              okText="Yes, Delete"
              cancelText="Cancel"
              onConfirm={() => handleDelete(record?.id)}
              okButtonProps={{ loading: deleteLoading }}
              loading={deleteLoading}
            >
              <Button
                type="text"
                shape="circle"
                icon={<Trash size={16} className="text-red-500" />}
              />
            </CustomConfirm>
          </Tooltip>
        </div>
      ),
      align: "center",
      fixed: "right",
      width: 110,
    },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1B70A6",
          colorInfo: "#1B70A6",
        },
      }}
    >
      {/* Filters */}
      <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex w-full gap-3 sm:w-auto">
          <Input
            placeholder="Search by name or email..."
            prefix={<Search className="mr-2 text-gray-400" size={18} />}
            className="h-11 w-full rounded-lg border text-base sm:w-72"
            allowClear
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
          />

          <Select
            placeholder="Filter by Interest"
            className="h-11 w-44"
            allowClear
            onChange={(value) => {
              setHasInterest(value);
              setCurrentPage(1);
            }}
            options={[
              { value: true, label: "Interested" },
              { value: false, label: "Not Interested" },
            ]}
          />
        </div>

        <p className="text-sm text-gray-500">
          Total:{" "}
          <span className="font-semibold">{bookingData?.meta?.total || 0}</span>{" "}
          bookings
        </p>
      </div>

      <Table
        style={{ overflowX: "auto" }}
        columns={columns}
        dataSource={data}
        scroll={{ x: "max-content" }}
        className="rounded-lg shadow-sm"
        rowClassName="hover:bg-gray-50"
        loading={isLoading}
        pagination={{
          current: currentPage,
          pageSize: limit || 10,
          total: bookingData?.meta?.total || 0,
          onChange: (page) => setCurrentPage(page),
          showSizeChanger: false,
        }}
      />

      {/* View Comments Modal */}
      <Modal
        title={
          <div>
            <p className="text-lg font-semibold text-gray-800">
              Booking Details
            </p>
            <p className="mt-1 text-sm font-normal text-gray-500">
              {selectedBooking?.customer_name}
            </p>
          </div>
        }
        open={viewModalOpen}
        onCancel={() => {
          setViewModalOpen(false);
          setSelectedBooking(null);
        }}
        footer={[
          <Button
            key="close"
            type="primary"
            onClick={() => {
              setViewModalOpen(false);
              setSelectedBooking(null);
            }}
          >
            Close
          </Button>,
        ]}
        width={800}
        centered
      >
        {selectedBooking && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Email
                </p>
                <p className="mt-1 text-gray-800">
                  {selectedBooking.customer_email}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Date
                </p>
                <p className="mt-1 text-gray-800">{selectedBooking.date}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Interest
                </p>
                <div className="mt-1">
                  {selectedBooking.hasInterest ? (
                    <Tag color="green">Interested</Tag>
                  ) : (
                    <Tag color="default">Not Interested</Tag>
                  )}
                </div>
              </div>
              {/* <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Service ID
                </p>
                <p className="mt-1 break-all text-sm text-gray-800">
                  {selectedBooking.service_id}
                </p>
              </div> */}
            </div>

            <div>
              <p className="mb-2 text-xs uppercase tracking-wide text-gray-500">
                Comments
              </p>
              <div className="max-h-72 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4">
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-gray-700">
                  {selectedBooking.comments}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </ConfigProvider>
  );
}
