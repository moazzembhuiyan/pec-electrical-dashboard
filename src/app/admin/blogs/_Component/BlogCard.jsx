import { Card, Button, Image, Space, Typography, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

export default function BlogCard({ blog, onEdit, onDelete, isDeleting }) {
  return (
    <Card
      hoverable
      cover={
        blog.featuredImage?.[0] ? (
          <Image
            alt={blog.title}
            src={blog.featuredImage[0]}
            height={200}
            style={{ objectFit: 'cover' }}
            preview={false}
          />
        ) : null
      }
      actions={[
        <Button
          key="edit"
          type="link"
          icon={<EditOutlined />}
          onClick={onEdit}
        >
          Edit
        </Button>,
        <Popconfirm
          key="delete"
          title="Are you sure you want to delete this blog?"
          onConfirm={onDelete}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            loading={isDeleting}
          >
            Delete
          </Button>
        </Popconfirm>,
      ]}
    >
      <Title level={5} ellipsis={{ rows: 2 }}>
        {blog.title}
      </Title>

      <Paragraph ellipsis={{ rows: 3 }} type="secondary">
        {blog.metaDescription || 'No description'}
      </Paragraph>

      <div className="mt-2 space-y-1">
        <Text type="secondary" className="text-xs block">
          <strong>Focus Keyword:</strong> {blog.focusKeyword || '—'}
        </Text>
        <Text type="secondary" className="text-xs block">
          <strong>Slug:</strong> {blog.urlHandler}
        </Text>
      </div>
    </Card>
  );
}