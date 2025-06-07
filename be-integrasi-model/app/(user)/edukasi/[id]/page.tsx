import ArticleDetailPage from "@/view/article-detail-view";

interface ArticleDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ArticleDetail({ params }: ArticleDetailPageProps) {
  return <ArticleDetailPage params={params} />;
}
