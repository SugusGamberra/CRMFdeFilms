import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./global.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CRM EcoMagic",
  description: "Plataforma de gestión de clientes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const savedTheme = localStorage.getItem('neu-ui-theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans min-h-full flex flex-col antialiased text-slate-700 dark:text-slate-200 transition-colors duration-500 ease-in-out`}>
        {children}
        
        <Toaster 
          position="top-right"
          toastOptions={{
            className: 'toast-base',
            success: {
              className: 'toast-base toast-success',
              iconTheme: { primary: '#fff', secondary: '#16a34a' }
            },
            error: {
              className: 'toast-base toast-error',
              iconTheme: { primary: '#fff', secondary: '#dc2626' }
            },
            style: {
              background: 'transparent',
              boxShadow: 'none',
              padding: 0,
              maxWidth: '400px',
            }
          }}
        />
      </body>
    </html>
  );
}