"use client";
import { useGetBlogsQuery, useDeleteBlogMutation } from '@/redux/api/blogApi';
import { Button, Spin, Empty, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import BlogCard from './BlogCard';
import AddBlogModal from './AddBlogModal';
import EditBlogModal from './EditBlogModal';
import toast from 'react-hot-toast';

export default function BlogsContainer() {
  const { data, isLoading, refetch } = useGetBlogsQuery();
  const [deleteBlog, { isLoading: isDeleting }] = useDeleteBlogMutation();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);

  const blogs = data?.data || [];

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteBlog(id).unwrap();
      toast.success('Blog deleted successfully');
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to delete blog');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Blog
        </Button>
      </div>

      {/* Blog Cards */}
      {blogs.length === 0 ? (
        <Empty description="No blogs found" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              blog={blog}
              onEdit={() => handleEdit(blog)}
              onDelete={() => handleDelete(blog._id)}
              isDeleting={isDeleting}
            />
          ))}
        </div>
      )}

      {/* Add Modal */}
      <AddBlogModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setIsAddModalOpen(false);
          refetch();
        }}
      />

      {/* Edit Modal */}
      <EditBlogModal
        open={isEditModalOpen}
        blog={selectedBlog}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedBlog(null);
        }}
        onSuccess={() => {
          setIsEditModalOpen(false);
          setSelectedBlog(null);
          refetch();
        }}
      />
    </div>
  );
}