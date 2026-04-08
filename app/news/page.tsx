import Link from "next/link";
import Image from "next/image";
import { readNews } from "@/lib/news";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Новости — Южный Континент",
  description: "Новости и статьи об экскурсиях в Сочи, Абхазии и Красной Поляне",
};

export default async function NewsPage() {
  const data = await readNews();
  const articles = data.articles
    .filter((a) => a.published)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <main className="pt-28 pb-20">
      <div className="container">
        <h1
          className="font-extrabold mb-4"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
        >
          Новости и <span className="text-gradient">статьи</span>
        </h1>
        <p className="text-muted-foreground mb-10 max-w-lg">
          Актуальная информация о маршрутах, сезонных предложениях и жизни Южного Континента
        </p>

        {articles.length === 0 ? (
          <p className="text-center text-muted-foreground py-20">Новостей пока нет</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                className="group flex flex-col rounded-2xl overflow-hidden bg-white dark:bg-[#111827] shadow-md hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48 overflow-hidden">
                  {article.image ? (
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-300">
                      Нет фото
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-1 p-5">
                  <time className="text-xs text-muted-foreground mb-2">
                    {new Date(article.publishedAt).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                  <h2 className="font-bold text-lg leading-tight mb-2 line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-sm text-muted-foreground flex-1 line-clamp-3 mb-3">
                    {article.excerpt}
                  </p>
                  <span className="text-turquoise-600 text-sm font-semibold flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                    Читать <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
