import type { AppProps } from "next/app";
import { Inter } from "@next/font/google";
import { ThemeProvider } from "next-themes";
import "../styles/globals.css";

const interVariable = Inter({ display: "swap" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <main className={interVariable.className}>
        <Component {...pageProps} />
      </main>
    </ThemeProvider>
  );
}
