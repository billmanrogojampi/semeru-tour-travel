import Navbar from './components/Navbar';
import './globals.css';

export const metadata = {
  title: 'Semeru Tour And Travel',
  description: 'Website agen wisata dengan navigasi Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
