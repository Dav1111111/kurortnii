import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Umbrella, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-turquoise-950 text-turquoise-50 pt-16 pb-6">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white">
              <Umbrella className="h-8 w-8" />
              <span>Южный Континент</span>
            </Link>
            <p className="text-turquoise-200">
              Лучший премиальный отдых на Черном море. Наслаждайтесь комфортом, сервисом и природой Сочи.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-turquoise-400" />
                <a href="tel:89891668631" className="text-turquoise-200 hover:text-white transition-colors">
                  Дианита: 8 989 166-86-31
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-turquoise-400" />
                <a href="tel:89885007418" className="text-turquoise-200 hover:text-white transition-colors">
                  Андрей: 8 988 500-74-18
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Новости и акции</h3>
            <p className="text-turquoise-200 mb-4">
              Подпишитесь на нашу рассылку, чтобы первыми узнавать о специальных предложениях.
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input 
                type="email" 
                placeholder="Ваш email" 
                className="bg-turquoise-900 text-white border-turquoise-800 focus-visible:ring-turquoise-400 h-11" 
              />
              <Button className="bg-coral-500 hover:bg-coral-600 text-white h-11 sm:px-6">
                <Mail className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline ml-2 sm:ml-0">Подписаться</span>
                <span className="sm:hidden ml-2">Подписаться</span>
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className="my-6 bg-turquoise-800" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-turquoise-300 text-center md:text-left">
            © 2025 Южный Континент. Все права защищены.
          </p>
          <div className="flex gap-4 text-sm text-turquoise-300">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Политика конфиденциальности
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Условия использования
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}