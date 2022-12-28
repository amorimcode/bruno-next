import Link from 'next/link';
import useSWR from 'swr';

import fetcher from '../lib/fetcher';
import { Views } from '../lib/types';

export default function BlogPost({
  slug,
  title,
  excerpt
}: {
  slug: string;
  title: string;
  excerpt: string;
}) {
  return (
    <Link href={`/blog/${slug}`} className="w-full">
      <div className="w-full mb-8">
        <div className="flex flex-col justify-between md:flex-row">
          <h4 className="w-full mb-2 text-lg font-medium text-gray-900 md:text-xl dark:text-gray-100">
            {title}
          </h4>
          <p className="w-32 mb-4 text-left text-gray-500 md:text-right md:mb-0">
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
          </p>
        </div>
        <p className="text-gray-600 dark:text-gray-400">{excerpt}</p>
      </div>
    </Link>
  );
}
