"use client";

import { Modal, Form, Input, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useUpdateServiceMutation } from "@/redux/api/serviceApi";
import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

const { TextArea } = Input;

export default function EditServiceModal({
  open,
  service,
  onClose,
  onSuccess,
}) {
  const [form] = Form.useForm();
  const [updateService, { isLoading }] = useUpdateServiceMutation();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (open && service) {
      form.setFieldsValue({
        type: service.type,
        description: service.description,
        urlHandler: service.urlHandler,
        metaTitle: service.metaTitle,
        metaDescription: service.metaDescription,
        info: service.info?.length
          ? service.info
          : [{ title: "", subTitle: "" }],
      });
      setFileList([]); // reset new uploads
    }
  }, [open, service, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const formData = new FormData();

      // Append new images (if any)
      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("images", file.originFileObj);
        }
      });

      const dataPayload = {
        type: values.type,
        description: values.description,
        urlHandler: values.urlHandler,
        metaTitle: values.metaTitle || "",
        metaDescription: values.metaDescription || "",
        info: values.info || [],
      };

      formData.append("data", JSON.stringify(dataPayload));

      await updateService({ id: service._id, body: formData }).unwrap();

      toast.success("Service updated successfully");
      setFileList([]);
      onSuccess?.();
      onClose();
    } catch (error) {
      if (error?.errorFields) return;
      toast.error(error?.data?.message || "Failed to update service");
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return Upload.LIST_IGNORE;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must be smaller than 5MB!");
        return Upload.LIST_IGNORE;
      }
      return false; // prevent auto upload
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList.slice(0, 2)); // max 2 images
    },
    fileList,
    maxCount: 2,
    listType: "picture-card",
    multiple: true,
  };

  return (
    <Modal
      title="Edit Service"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={isLoading}
      width={800}
      destroyOnClose
      okText="Update Service"
      centered
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="type"
          label="Service Type"
          rules={[{ required: true, message: "Please enter service type" }]}
        >
          <Input placeholder="e.g. Standard Delivery" />
        </Form.Item>

        <Form.Item
          name="urlHandler"
          label="URL Handler (Slug)"
          rules={[{ required: true, message: "Please enter url handler" }]}
        >
          <Input placeholder="e.g. standard-delivery" />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <TextArea rows={4} placeholder="Service description" />
        </Form.Item>

        {/* ========== Current Images ========== */}
        {service?.images?.length > 0 && (
          <Form.Item label="Current Images">
            <div className="flex flex-wrap gap-4">
              {service.images.map((img, index) => (
                <div
                  key={index}
                  className="relative h-36 w-52 overflow-hidden rounded-lg border"
                >
                  <Image
                    src={img}
                    alt={`Current image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Upload new images below only if you want to replace them.
              Otherwise existing images will remain.
            </p>
          </Form.Item>
        )}

        {/* ========== Upload New Images ========== */}
        <Form.Item label="Change Images (optional - max 2)">
          <Upload {...uploadProps}>
            {fileList.length < 2 && (
              <div>
                <UploadOutlined />
                <div className="mt-2">Upload</div>
              </div>
            )}
          </Upload>
        </Form.Item>

        {/* ========== Info Fields ========== */}
        {service?.info?.length > 0 && (
          <div className="mb-4">
            <label className="mb-2 block font-medium">Service Info</label>

            <Form.List name="info">
              {(fields) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <div
                      key={key}
                      className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2"
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "title"]}
                        rules={[{ required: true, message: "Title required" }]}
                        className="mb-0"
                      >
                        <Input placeholder="Title" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, "subTitle"]}
                        rules={[
                          { required: true, message: "Subtitle required" },
                        ]}
                        className="mb-0"
                      >
                        <Input placeholder="Subtitle" />
                      </Form.Item>
                    </div>
                  ))}
                </>
              )}
            </Form.List>
          </div>
        )}

        <Form.Item name="metaTitle" label="Meta Title">
          <Input placeholder="SEO meta title" />
        </Form.Item>

        <Form.Item name="metaDescription" label="Meta Description">
          <TextArea rows={3} placeholder="SEO meta description" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
