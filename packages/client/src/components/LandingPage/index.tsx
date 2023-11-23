'use client';
import Link from "next/link";
import Flow from "../Flow";

export default function LandingPage() {
  return(
    <div className='w-full min-h-main grid gap-4 grid-cols-2'>
      <div className="flex flex-col justify-center pl-12 gap-4">
        <h1 className="text-5xl">
          Not just <span className="text-red-900 relative">
            <span className="absolute blur-lg top-0 left-0 underline">Tokenbound</span>
            Tokenbound
          </span>
        </h1>
        <h1 className="text-5xl">
          But Tokenbound-<span className="text-blue-500 relative text-6xl">
          <span className="absolute blur-lg top-0 left-0 underline">Chainlink</span>
            Chainlink
            </span>
        </h1>
        <div className="flex items-center gap-4 mt-16">
          <p className="text-slate-400">Create your first Tokenbound-Chainlink</p>
          <Link href='/create'>
            <button className="btn btn-outline rounded-full text-blue-500 hover:bg-blue-600 text-lg w-32">Create</button>
          </Link>
        </div>
      </div>
      <div style={{ height: '100%' }}>
        <Flow/>
      </div>
    </div>
  )
}