import { readNews } from "@/lib/news";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const data = await readNews();
  return data.articles
    .filter((a) => a.published)
    .map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await readNews();
  const article = data.articles.find((a) => a.slug === params.slug && a.published);
  if (!article) return { title: "Не найдено" };
  return {
    title: `${article.title} — Южный Континент`,
    description: article.excerpt,
  };
}

export default async function NewsArticlePage({ params }: { params: { slug: string } }) {
  const data = await readNews();
  const article = data.articles.find((a) => a.slug === params.slug && a.published);
  if (!article) notFound();

  return (
    <main className="pt-28 pb-20">
      <div className="container max-w-3xl">
        <Link
          href="/news"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ChevronLeft className="h-4 w-4" /> Все новости
        </Link>

        <time className="text-sm text-muted-foreground block mb-3">
          {new Date(article.publishedAt).toLocaleDateString("ru-RU", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </time>

        <h1
          className="font-extrabold mb-8"
          style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", lineHeight: 1.15, letterSpacing: "-0.02em" }}
        >
          {article.title}
        </h1>

        {article.image && (
          <div className="relative w-full h-64 sm:h-80 lg:h-96 rounded-2xl overflow-hidden mb-8">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none">
          {article.content.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>
    </main>
  );
}
