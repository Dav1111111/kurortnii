"use client";

import { NewsForm } from "@/components/admin/NewsForm";
import type { NewsArticle } from "@/lib/news";

export function NewsEditClient({ article }: { article: NewsArticle }) {
  return <NewsForm initialData={article} articleId={article.id} />;
}
