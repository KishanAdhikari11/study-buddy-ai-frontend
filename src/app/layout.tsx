import "@/app/globals.css";
import { Outfit } from 'next/font/google';

const outfit = Outfit({ 
  subsets: ['latin'],
  display: 'swap', 
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${outfit.className} bg-[#0a0a0a] antialiased text-white min-h-screen`}>
        {children}
      </body>
    </html>
  );
}