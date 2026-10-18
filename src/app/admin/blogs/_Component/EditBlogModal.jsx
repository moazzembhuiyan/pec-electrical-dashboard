"use client";
import { Modal, Form, Input, Upload, message, Button, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useUpdateBlogMutation } from '@/redux/api/blogApi';
import { useEffect, useState } from 'react';
import dynamic from "next/dynamic";
import toast from 'react-hot-toast';

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

const { TextArea } = Input;

export default function EditBlogModal({ open, blog, onClose, onSuccess }) {
  const [form] = Form.useForm();
  const [updateBlog, { isLoading }] = useUpdateBlogMutation();
  const [fileList, setFileList] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (open && blog) {
      form.setFieldsValue({
        title: blog.title,
        slug: blog.urlHandler || blog.slug,
        focusKeyword: blog.focusKeyword,
        metaTitle: blog.metaTitle,
        metaDescription: blog.metaDescription,
      });
      setContent(blog.content || '');
      setFileList([]); // reset new file
    }
  }, [open, blog, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!content || content.trim() === '') {
        toast.error('Please enter content');
        return;
      }

      const formData = new FormData();

      // Only append new image if user selected one
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('files', fileList[0].originFileObj);
      }

      const dataPayload = {
        title: values.title,
        urlHandler: values.slug,
        content: content,
        focusKeyword: values.focusKeyword || '',
        metaTitle: values.metaTitle || '',
        metaDescription: values.metaDescription || '',
      };

      formData.append('data', JSON.stringify(dataPayload));

      await updateBlog({ id: blog._id, body: formData }).unwrap();
      
      toast.success('Blog updated successfully');
      setFileList([]);
      onSuccess();
    } catch (error) {
      if (error?.errorFields) return;
      toast.error(error?.data?.message || 'Failed to update blog');
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return Upload.LIST_IGNORE;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Image must be smaller than 5MB!');
        return Upload.LIST_IGNORE;
      }
      return false;
    },
    onChange: ({ fileList: newFileList }) => {
      setFileList(newFileList.slice(-1));
    },
    fileList,
    maxCount: 1,
    listType: 'picture',
  };

  return (
    <Modal
      title="Edit Blog"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={isLoading}
      width={1000}
      destroyOnClose
      okText="Update Blog"
      centered
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please enter title' }]}
        >
          <Input placeholder="Enter blog title" />
        </Form.Item>

        <Form.Item
          name="slug"
          label="Slug"
          rules={[{ required: true, message: 'Please enter slug' }]}
        >
          <Input placeholder="e.g. 10-essential-construction-planning-tips" />
        </Form.Item>

        <Form.Item
          label="Content"
          required
          rules={[{ required: true, message: 'Please enter content' }]}
        >
          <JoditEditor
            config={{
              height: 300,
              placeholder: "Write blog content (HTML supported)",
              uploader: {
                insertImageAsBase64URI: true,
              },
            }}
            value={content}
            onBlur={(newContent) => {
              setContent(newContent);
            }}
          />
        </Form.Item>

        {/* Current Image Preview */}
        {blog?.featuredImage?.[0] && (
          <Form.Item label="Current Featured Image">
            <Image
              src={blog.featuredImage[0]}
              width={200}
              style={{ borderRadius: 8, objectFit: 'cover' }}
            />
          </Form.Item>
        )}

        <Form.Item label="Change Featured Image (optional)">
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Upload New Image</Button>
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