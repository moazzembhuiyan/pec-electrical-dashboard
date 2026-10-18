"use client";

import {
  useGetSeoDataQuery,
  useUpdateSeoDataMutation,
} from "@/redux/api/seoAPi";
import { Button, Card, Form, Input, Spin, message } from "antd";
import { useEffect } from "react";
import toast from "react-hot-toast";

const { TextArea } = Input;

export default function SeoMetaContainer() {
  const [form] = Form.useForm();
  const { data, isLoading: isFetching } = useGetSeoDataQuery();
  const [updateSeoData, { isLoading: isUpdating }] = useUpdateSeoDataMutation();

  // Load existing data into form
  useEffect(() => {
    if (data?.data?.value) {
      form.setFieldsValue(data.data?.value);
    }
  }, [data, form]);

  const handleSubmit = async (values) => {
    try {
      await updateSeoData({ data: values }).unwrap();
      toast.success("SEO Meta data updated successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update SEO data");
    }
  };

  if (isFetching) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  const pages = [
    { key: "home", label: "Home Page" },
    { key: "aboutUs", label: "About Us Page" },
    { key: "service", label: "Service Page" },
    { key: "gallery", label: "Gallery Page" },
    { key: "blogs", label: "Blogs Page" },
    { key: "contact", label: "Contact Page" },
  ];

  return (
    <div className="!p-6">
      <div className="!mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">SEO Meta Settings</h1>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="max-w-4xl"
      >
        {pages.map((page) => (
          <Card
            key={page.key}
            title={page.label}
            className="!mb-6"
            size="small"
          >
            <Form.Item
              name={`${page.key}MetaTitle`}
              label="Meta Title"
              rules={[{ required: true, message: "Please enter meta title" }]}
            >
              <Input placeholder={`${page.label} Meta Title`} />
            </Form.Item>

            <Form.Item
              name={`${page.key}MetaDescription`}
              label="Meta Description"
              rules={[
                { required: true, message: "Please enter meta description" },
              ]}
            >
              <TextArea
                rows={3}
                placeholder={`${page.label} Meta Description`}
                showCount
                maxLength={160}
              />
            </Form.Item>
          </Card>
        ))}

        <div className="!mt-4 flex justify-end">
          <Button
            type="primary"
            htmlType="submit"
            loading={isUpdating}
            size="large"
          >
            Update SEO Data
          </Button>
        </div>
      </Form>
    </div>
  );
}
