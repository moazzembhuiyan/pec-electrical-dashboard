"use client";
import { Modal, Form, Input, Upload, message, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useCreateBlogMutation } from "@/redux/api/blogApi";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

const { TextArea } = Input;

export default function AddBlogModal({ open, onClose, onSuccess }) {
  const [form] = Form.useForm();
  const [createBlog, { isLoading }] = useCreateBlogMutation();
  const [fileList, setFileList] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (open) {
      form.resetFields();
      setFileList([]);
    }
  }, [open, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (fileList.length === 0) {
        toast.error("Please upload a featured image");
        return;
      }

      const formData = new FormData();

      // Image file
      formData.append("files", fileList[0].originFileObj);

      // Rest of the data as JSON string
      const dataPayload = {
        title: values.title,
        urlHandler: values.slug,
        content: content,
        focusKeyword: values.focusKeyword || "",
        metaTitle: values.metaTitle || "",
        metaDescription: values.metaDescription || "",
      };

      formData.append("data", JSON.stringify(dataPayload));

      await createBlog(formData).unwrap();
      toast.success("Blog created successfully");
      form.resetFields();
      setFileList([]);
      onSuccess();
    } catch (error) {
      if (error?.errorFields) return;
      toast.error(error?.data?.message || "Failed to create blog");
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
      setFileList(newFileList.slice(-1)); // only keep 1 file
    },
    fileList,
    maxCount: 1,
    listType: "picture",
  };

  return (
    <Modal
      title="Add New Blog"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={isLoading}
      width={1000}
      destroyOnClose
      okText="Create Blog"
      centered
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter title" }]}
        >
          <Input placeholder="Enter blog title" />
        </Form.Item>

        <Form.Item
          name="slug"
          label="Slug"
          rules={[{ required: true, message: "Please enter slug" }]}
        >
          <Input placeholder="e.g. 10-essential-construction-planning-tips" />
        </Form.Item>

        <Form.Item
          name="content"
          label="Content"
          rules={[{ required: true, message: "Please enter content" }]}
        >
          <JoditEditor
            config={{
              height: 300,
              placeholder: "Write blog content (HTML supported)",
              // controls: {
              //   font: {
              //     list: Jodit.atom({
              //       "General Sans": "General Sans",
              //     }),
              //   },
              // },
              uploader: {
                insertImageAsBase64URI: true,
              },
            }}
            value={content}
            onBlur={(content) => {
              setContent(content);
              field.onChange(content);
            }}
          />
        </Form.Item>

        <Form.Item label="Featured Image" required>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
        </Form.Item>

        <Form.Item name="focusKeyword" label="Focus Keyword">
          <Input placeholder="e.g. construction planning" />
        </Form.Item>

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
