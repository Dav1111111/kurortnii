"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin/tours");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error ?? "Неверный пароль");
      }
    } catch {
      setError("Ошибка подключения");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-turquoise-100 dark:bg-turquoise-900/40 rounded-full flex items-center justify-center">
            <Lock className="h-6 w-6 text-turquoise-600 dark:text-turquoise-400" />
          </div>
        </div>

        <h1 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-1">
          Вход в панель
        </h1>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
          Южный Континент — администратор
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-turquoise-500 focus:border-transparent text-sm"
              placeholder="Введите пароль"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-[#0A1628] hover:bg-[#122040] text-white font-semibold rounded-xl transition-colors disabled:opacity-60 text-sm"
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
}
