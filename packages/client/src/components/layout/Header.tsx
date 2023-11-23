'use client';
import Wallet from '@/components/Providers/wallet';
import Link from 'next/link';

export default function Header() {
  return (
    <header className='sticky top-0 z-50'>
      <div className='layout flex items-center justify-between'>
        <div className="navbar rounded-box m-5 bg-[#26292B]">
          <div className="flex-1">
            <Link href='/'>
              <button className="btn btn-ghost text-xl">Home</button>
            </Link>
          </div>
          <div className="flex-none">
            <Wallet/>
          </div>
        </div>
      </div>
    </header>
  );
}
