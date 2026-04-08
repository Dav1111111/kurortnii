import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { readNews } from "@/lib/news";
import { notFound } from "next/navigation";
import { NewsEditClient } from "./NewsEditClient";

export default async function EditNewsPage({ params }: { params: { id: string } }) {
  const data = await readNews();
  const article = data.articles.find((a) => a.id === params.id);
  if (!article) notFound();

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/news" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Редактирование</h1>
          <p className="text-sm text-gray-500 truncate max-w-xs">{article.title}</p>
        </div>
      </div>
      <NewsEditClient article={article} />
    </div>
  );
}
