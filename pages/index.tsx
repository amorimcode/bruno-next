import { Inter } from '@next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import BlogPostCard from '../components/BlogPostCard';
import Container from '../components/Container';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <>
      <Container>
        <div className="flex flex-col justify-center items-start max-w-2xl border-gray-200 dark:border-gray-700 mx-auto pb-16">
          <div className="flex flex-col-reverse sm:flex-row items-start">
            <div className="flex flex-col pr-8">
              <h1 className="font-bold text-3xl md:text-5xl tracking-tight mb-1 text-black dark:text-white">
                Bruno Amorim
              </h1>
              <h2 className="text-gray-700 dark:text-gray-200 mb-4">
                Desenvolvedor front-end{' '}
                <span className="font-semibold">@mblabs</span>
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-16">
                Desenvolvedor apaixonado por tecnologia, focado em front-end e
                experiência do usuário, design de interfaces responsivas e
                escaláveis, com arquitetura robusta. Experiência em
                desenvolvimento web e mobile (react, react-native), trabalho em
                equipe e conversa com cliente.
              </p>
            </div>
            <div className="w-[80px] sm:w-[450px] relative mb-8 sm:mb-0 mr-auto">
              <Image
                alt="Bruno Amorim"
                height={176}
                width={176}
                src="https://github.com/amorimcode.png"
                sizes="30vw"
                priority
                className="rounded-full filter grayscale"
              />
            </div>
          </div>

          <h3 className="font-bold text-2xl md:text-4xl tracking-tight mb-6 text-black dark:text-white">
            Principais Publicações
          </h3>
          <div className="flex gap-6 flex-col md:flex-row">
            <BlogPostCard
              title="Lançamento do Turbopack no Next.js 13"
              slug="lancamento-do-turbopack-no-next-js-13"
              gradient="from-[#D8B4FE] to-[#818CF8]"
            />
            <BlogPostCard
              title="Lançamento do Turbopack no Next.js 13"
              slug="lancamento-do-turbopack-no-next-js-13"
              gradient="from-[#6EE7B7] via-[#3B82F6] to-[#9333EA]"
            />
            <BlogPostCard
              title="Lançamento do Turbopack no Next.js 13"
              slug="lancamento-do-turbopack-no-next-js-13"
              gradient="from-[#FDE68A] via-[#FCA5A5] to-[#FECACA]"
            />
          </div>

          <Link
            href="/blog"
            className="flex items-center mt-8 text-gray-600 dark:text-gray-400 leading-7 rounded-lg hover:text-gray-800 dark:hover:text-gray-200 transition-all h-6"
          >
            <>
              {'Ler todas'}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-6 w-6 ml-1"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.5 12h-15m11.667-4l3.333 4-3.333-4zm3.333 4l-3.333 4 3.333-4z"
                />
              </svg>
            </>
          </Link>
        </div>
      </Container>
    </>
  );
}
