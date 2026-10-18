"use client";

import { RiCloseLargeLine } from "react-icons/ri";
import {
  Form,
  Input,
  Button,
  Upload,
  message,
  Modal,
  Divider,
  Select,
} from "antd";
import { DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import { useGetServicesQuery } from "@/redux/api/serviceApi";
import { useCreateGalleryItemMutation } from "@/redux/api/gellary";
import toast from "react-hot-toast";
import { useState } from "react";

const { Dragger } = Upload;

const AddNewGelleryModal = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  // create gallery item
  const [addItem, { isLoading: isAdding }] = useCreateGalleryItemMutation();

  // get service categories from api
  const { data, isLoading: servicesLoading } = useGetServicesQuery({
    limit: 900000,
    page: 1,
  });
  const services = data?.data || [];

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      // Append form data WITHOUT images array
      const galleryData = {
        title: values.galleryTitle,
        description: values.gallerySubTitle,
        service: values.serviceId,
      };
      formData.append("data", JSON.stringify(galleryData));

      // Append ONLY 1 image file (not array)
      const selectedFile = fileList[0];
      if (selectedFile?.originFileObj) {
        formData.append("image", selectedFile.originFileObj);
      }

      const result = await addItem(formData).unwrap();
      if (result.success) {
        toast.success("Gallery item created successfully");
        setOpen(false);
        form.resetFields();
        setFileList([]);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create gallery item");
    }
  };

  const uploadProps = {
    name: "images",
    multiple: false, // Single image only
    fileList,
    onChange: ({ fileList: newFileList }) => {
      // Strictly 1 file only
      if (newFileList.length > 1) {
        message.warning("Only 1 image allowed!");
        return;
      }
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      const isImage = file.type && file.type.startsWith("image/");
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isImage) {
        message.error("You can only upload image files!");
        return Upload.LIST_IGNORE;
      }

      if (!isLt5M) {
        message.error("Image must be smaller than 5MB!");
        return Upload.LIST_IGNORE;
      }

      message.success(`${file.name} selected successfully.`);
      return false; // Prevent auto upload
    },
    maxCount: 1,
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <DeleteOutlined />,
    },
  };

  const handleRemoveFile = (file) => {
    setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  if (servicesLoading) {
    return (
      <Modal open={open} footer={null} centered closeIcon={false}>
        <div className="py-4 text-center">Loading services...</div>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      footer={null}
      centered
      onCancel={() => setOpen(false)}
      closeIcon={false}
      className="relative min-w-[90vw] md:min-w-[800px]"
      confirmLoading={isAdding}
    >
      <div
        className="absolute right-0 top-0 z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-bl-3xl bg-gray-100"
        onClick={() => setOpen(false)}
      >
        <RiCloseLargeLine size={18} className="text-black" />
      </div>

      <h1 className="mb-4 text-center text-2xl font-semibold">
        Add Gallery Item
      </h1>
      <Divider className="my-4" />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mx-auto max-w-3xl px-4"
      >
        <Form.Item
          label="Gallery Title"
          name="galleryTitle"
          rules={[{ required: true, message: "Please enter gallery title" }]}
        >
          <Input className="h-12" placeholder="Enter gallery title" />
        </Form.Item>

        <Form.Item
          label="Gallery Sub-Title"
          name="gallerySubTitle"
          rules={[
            { required: true, message: "Please enter gallery sub-title" },
          ]}
        >
          <Input className="h-12" placeholder="Enter gallery sub-title" />
        </Form.Item>

        {/* Gallery Image Upload - Single Image */}
        <Form.Item
          label="Gallery Image (1 image required)"
          name="images"
          className="mb-6"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) return e;
            return e?.fileList || [];
          }}
          rules={[
            {
              validator: (_, value) => {
                if (!value || value.length === 0) {
                  return Promise.reject(
                    new Error("Please upload a gallery image"),
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Upload.Dragger {...uploadProps} listType="picture" accept="image/*">
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag image to upload</p>
            <p className="ant-upload-hint">
              Support JPG, PNG files (1 image only, max 5MB)
            </p>
          </Upload.Dragger>

          {fileList.length > 0 && (
            <p className="mt-2 text-sm text-green-600">
              Image selected: {fileList[0]?.name}
            </p>
          )}
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="h-12 w-full bg-black text-white hover:bg-gray-800"
            loading={isAdding}
            disabled={fileList.length === 0}
          >
            {isAdding ? "Creating..." : "Create Gallery Item"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddNewGelleryModal;
