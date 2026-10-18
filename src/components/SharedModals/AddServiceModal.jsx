"use client";

import { RiCloseLargeLine } from "react-icons/ri";
import { useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Upload,
  message,
  Modal,
  Divider,
} from "antd";
import { DeleteOutlined, InboxOutlined } from "@ant-design/icons";
import { useCreateServiceMutation } from "@/redux/api/serviceApi";
import toast from "react-hot-toast";
import TextArea from "antd/es/input/TextArea";

const { Title } = Typography;

const AddserviceModal = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const [addService, { isLoading }] = useCreateServiceMutation();

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();

      // Append service data
      const serviceData = {
        type: values.type,
        description: values.description,
        info: values.info || [],
        urlHandler: values.urlHandler,
        metaTitle: values.metaTitle || '',
        metaDescription: values.metaDescription || '',
      };
      formData.append("data", JSON.stringify(serviceData));

      // Append maximum 2 images
      fileList.slice(0, 2).forEach((file) => {
        if (file.originFileObj) {
          formData.append("images", file.originFileObj);
        }
      });

      const result = await addService(formData).unwrap();
      if (result.success) {
        toast.success("Service created successfully");
      }
      setOpen(false);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      toast.error(error?.data?.message || "Failed to create service");
    }
  };

  const uploadProps = {
    name: "images",
    multiple: true,
    fileList,
    onChange: ({ fileList: newFileList }) => {
      // Limit to maximum 2 files
      if (newFileList.length > 2) {
        message.warning("Maximum 2 images allowed!");
        return;
      }
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      const isImage = file.type && file.type.startsWith("image/");
      const isLt5M = file.size / 1024 / 1024 < 5;

      if (!isImage) {
        message.error("You can only upload image files!");
        return false;
      }

      if (!isLt5M) {
        message.error("Image must be smaller than 5MB!");
        return false;
      }

      message.success(`${file.name} selected successfully.`);
      return false; // Prevent auto upload
    },
    maxCount: 2,
    showUploadList: {
      showRemoveIcon: true,
      removeIcon: <DeleteOutlined />,
    },
  };

  const handleRemoveFile = (file) => {
    setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
  };

  return (
    <Modal
      open={open}
      footer={null}
      centered
      onCancel={() => setOpen(false)}
      closeIcon={false}
      className="relative min-w-[90vw] md:min-w-[800px]"
      confirmLoading={isLoading}
    >
      <div
        className="absolute right-0 top-0 z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-bl-3xl bg-gray-100"
        onClick={() => setOpen(false)}
      >
        <RiCloseLargeLine size={18} className="text-black" />
      </div>

      <h1 className="mb-4 text-center text-2xl font-semibold">Add Services</h1>
      <Divider className="my-4" />

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="mx-auto max-w-3xl px-4"
        initialValues={{
          info: [
            { title: "", subTitle: "" },
            { title: "", subTitle: "" },
          ],
        }}
      >
        <Form.Item
          label="Service Title"
          name="type"
          rules={[{ required: true, message: "Please enter Service title" }]}
        >
          <Input className="h-12" placeholder="Enter service title" />
        </Form.Item>

        <Form.Item
          label="Service Description"
          name="description"
          rules={[
            { required: true, message: "Please enter Service description" },
          ]}
        >
          <Input.TextArea
            rows={3}
            className="h-auto"
            placeholder="Enter service description"
          />
        </Form.Item>

        {/* Fixed 2 Specifications - Corrected info array structure */}
        <div className="mb-6">
          <Title level={5} className="mb-4">
            Specifications (Exactly 2 required)
          </Title>

          {[0, 1].map((index) => (
            <div
              key={index}
              className="mb-4 flex items-end gap-4 rounded-lg border bg-gray-50 p-3"
            >
              <div className="flex-1">
                <Form.Item
                  label={`Specification ${index + 1} Title`}
                  name={["info", index, "title"]}
                  rules={[
                    {
                      required: true,
                      message: `Specification ${index + 1} title is required`,
                    },
                  ]}
                >
                  <Input
                    className="h-12"
                    placeholder={`Specification ${index + 1} title`}
                  />
                </Form.Item>
              </div>

              <div className="flex-1">
                <Form.Item
                  label={`Specification ${index + 1} Description`}
                  name={["info", index, "subTitle"]}
                  rules={[
                    {
                      required: true,
                      message: `Specification ${index + 1} description is required`,
                    },
                  ]}
                >
                  <Input
                    className="h-12"
                    placeholder={`Specification ${index + 1} description`}
                  />
                </Form.Item>
              </div>
            </div>
          ))}
        </div>

        <Form.Item
          label="Service Images (Max 2)"
          name="images"
          className="mb-6"
          valuePropName="fileList"
          getValueFromEvent={(e) => {
            if (Array.isArray(e)) return e;
            return e && e.fileList;
          }}
          rules={[{ required: false, message: "Please upload service images" }]}
        >
          <Upload.Dragger {...uploadProps} listType="picture" accept="image/*">
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag images to upload</p>
            <p className="ant-upload-hint">
              Support JPG, PNG files (Max 2 images, 5MB each)
            </p>
          </Upload.Dragger>
          {fileList.length > 0 && (
            <p className="mt-2 text-sm text-green-600">
              {fileList.length} / 2 image(s) selected
            </p>
          )}
          {fileList.length === 2 && (
            <p className="mt-1 text-sm text-orange-600">
              Maximum images reached
            </p>
          )}

                  <Form.Item
                    className="!mt-4"
                    name="urlHandler"
                    label="Slug"
                    rules={[{ required: true, message: 'Please enter slug' }]}
                  >
                    <Input placeholder="e.g. 10-essential-construction-planning-tips" />
                  </Form.Item>
        </Form.Item>
            <Form.Item name="metaTitle" label="Meta Title">
                  <Input placeholder="SEO meta title" />
                </Form.Item>
        
                <Form.Item name="metaDescription" label="Meta Description">
                  <TextArea rows={3} placeholder="SEO meta description" />
                </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="h-12 w-full bg-black text-white hover:bg-gray-800"
            loading={isLoading}
          >
            {isLoading ? "Creating..." : "Create Service"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddserviceModal;
