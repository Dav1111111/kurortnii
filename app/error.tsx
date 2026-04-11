"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white mb-4">500</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Что-то пошло не так. Попробуйте обновить страницу.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-full font-semibold text-white text-sm transition-all hover:shadow-lg"
            style={{ background: "linear-gradient(135deg, #FF7F50, #f05d29)" }}
          >
            Попробовать снова
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-full font-semibold text-sm border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
