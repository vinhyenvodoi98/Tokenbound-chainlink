import { AppProps } from 'next/app';

import { ToastContainer } from "react-toastify";

import '@/styles/globals.css';
import "react-toastify/ReactToastify.min.css";

import Header from '@/components/layout/Header';

import { useIsSsr } from '../utils/ssr';
import { ContractProvider } from '@/contexts/Contract';
import Providers from '@/components/Providers';

function MyApp({ Component, pageProps }: AppProps) {
  const isSsr = useIsSsr();
  if (isSsr) {
    return <div></div>;
  }

  return (
    <Providers>
      <div
        className='
          w-full
          min-h-screen
          bg-gradient-to-r
          from-[#151516]
          to-[#232425]
          background-animate
        '
      >
      <div className='
          w-full
          min-h-screen
          bg-[url("/png/nham.png")]
          text-white
          '>
        <Header />
        <ContractProvider>
          <Component {...pageProps} />
        </ContractProvider>
        <ToastContainer position="bottom-right" newestOnTop />
      </div>
      </div>
    </Providers>
  );
}

export default MyApp;
