import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="navbar-wrapper">
      <div className="navbar-brand">Semeru Tour</div>
      <nav className="navbar-links">
        <Link href="/">Home</Link>
        <Link href="/paket-wisata">Paket Wisata</Link>
        <Link href="/galeri">Galeri</Link>
        <Link href="/jadwal">Jadwal</Link>
        <Link href="/kontak">Kontak</Link>
      </nav>
    </header>
  );
}
