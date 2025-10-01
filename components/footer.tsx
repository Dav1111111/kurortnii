import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Umbrella, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-turquoise-950 text-turquoise-50 pt-16 pb-6">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-white">
              <Umbrella className="h-8 w-8" />
              <span>Курортный Сочи</span>
            </Link>
            <p className="text-turquoise-200">
              Лучший премиальный отдых на Черном море. Наслаждайтесь комфортом, сервисом и природой Сочи.
            </p>
            <div className="flex gap-4">
              <Button size="icon" variant="ghost" className="text-white hover:text-turquoise-400 hover:bg-turquoise-900/50">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Button>
              <Button size="icon" variant="ghost" className="text-white hover:text-turquoise-400 hover:bg-turquoise-900/50">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
              <Button size="icon" variant="ghost" className="text-white hover:text-turquoise-400 hover:bg-turquoise-900/50">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Быстрые ссылки</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-turquoise-200 hover:text-white transition-colors">
                  Услуги
                </Link>
              </li>
              <li>
                <Link href="/attractions" className="text-turquoise-200 hover:text-white transition-colors">
                  Достопримечательности
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-turquoise-200 hover:text-white transition-colors">
                  Галерея
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-turquoise-200 hover:text-white transition-colors">
                  Контакты
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Контакты</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-turquoise-400 mt-0.5" />
                <span className="text-turquoise-200">
                  Курортный проспект 47, Сочи, Россия
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-turquoise-400" />
                <span className="text-turquoise-200">+7 (800) 123-45-67</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-turquoise-400" />
                <span className="text-turquoise-200">info@kurortny-sochi.ru</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Новости и акции</h3>
            <p className="text-turquoise-200 mb-4">
              Подпишитесь на нашу рассылку, чтобы первыми узнавать о специальных предложениях.
            </p>
            <div className="flex gap-2">
              <Input 
                type="email" 
                placeholder="Ваш email" 
                className="bg-turquoise-900 text-white border-turquoise-800 focus-visible:ring-turquoise-400" 
              />
              <Button className="bg-coral-500 hover:bg-coral-600 text-white">
                <Mail className="h-4 w-4 mr-2" />
                <span>Подписаться</span>
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className="my-6 bg-turquoise-800" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-turquoise-300 text-center md:text-left">
            © 2025 Курортный Сочи. Все права защищены.
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