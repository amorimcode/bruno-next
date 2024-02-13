import Link from 'next/link';
import React from 'react';

const ExternalLink = ({ children, href }: any) => (
  <a
    className="text-gray-500 hover:text-gray-600 transition"
    target="_blank"
    rel="noopener noreferrer"
    href={href}
  >
    {children}
  </a>
);

export default function Footer() {
  return (
    <footer className="flex flex-col justify-center items-start max-w-2xl mx-auto w-full mb-8">
      <hr className="w-full border-1 border-gray-200 dark:border-gray-800 mb-8" />
      <div className="w-full max-w-2xl grid grid-cols-1 gap-4 pb-16 sm:grid-cols-3">
        <div className="flex flex-col space-y-4">
          <Link
            href="/"
            className="text-gray-500 hover:text-gray-600 transition"
          >
            Início
          </Link>
          <Link
            href="/about"
            className="text-gray-500 hover:text-gray-600 transition"
          >
            Sobre
          </Link>
          <Link
            href="/blog"
            className="text-gray-500 hover:text-gray-600 transition"
          >
            Blog
          </Link>
        </div>
        <div className="flex flex-col space-y-4">
          <ExternalLink href="https://github.com/amorimcode">
            GitHub
          </ExternalLink>
          <ExternalLink href="https://www.linkedin.com/in/amorim-bruno/">
            Linkedin
          </ExternalLink>
        </div>
        <div className="flex flex-col space-y-4">
          <ExternalLink href="https://docs.google.com/document/d/1ytfk3mYalVlSdQmBxfuDNgCVc_b7sFVFLLJVDNZWI74/edit?usp=sharing">
            Currículo
          </ExternalLink>
        </div>
      </div>
    </footer>
  );
}
