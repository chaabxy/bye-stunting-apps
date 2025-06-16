import type React from "react";
import { Card, Typography, Tag } from "antd";
import { ClockCircleOutlined, EyeOutlined } from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import type { Article } from "../../model/user/edukasi-model";

const { Title, Paragraph, Text } = Typography;

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  return (
    <Card
      hoverable
      className="h-full flex flex-col"
      cover={
        <div className="relative w-full h-48">
          <Image
            src={
              article.featured_image || "/placeholder.svg?height=200&width=400"
            }
            alt={article.title}
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      }
    >
      <div className="flex flex-col flex-grow">
        <div className="mb-2">
          <Tag color="blue">{article.category}</Tag>
        </div>

        <Title
          level={4}
          className="mb-2"
          ellipsis={{ rows: 2, tooltip: article.title }}
        >
          <Link
            href={`/edukasi/${article.slug || article.id}`}
            className="text-inherit hover:text-blue-600"
          >
            {article.title}
          </Link>
        </Title>

        <Paragraph ellipsis={{ rows: 3 }} className="mb-4 flex-grow">
          {article.excerpt}
        </Paragraph>

        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-center">
            <ClockCircleOutlined className="mr-1" />
            <Text type="secondary">{article.reading_time} menit</Text>
          </div>

          <div className="flex items-center">
            <EyeOutlined className="mr-1" />
            <Text type="secondary">{article.view_count}</Text>
          </div>
        </div>

        <div className="mt-4">
          <Link
            href={`/edukasi/${article.slug || article.id}`}
            className="text-blue-600 hover:text-blue-800"
          >
            Baca selengkapnya
          </Link>
        </div>
      </div>
    </Card>
  );
};
