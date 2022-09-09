import '../styles/globals.css'
import 'antd/dist/antd.css';
import 'react-toastify/dist/ReactToastify.css';
import UserProvider from '../providers/UserProvider';
import ActionsProvider from '../providers/ActionsProvider';
import { ToastContainer } from 'react-toastify';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const [pageLoading, setPageLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleStart = () => { setPageLoading(true); };
    const handleComplete = () => { setPageLoading(false); };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);
  }, [router]);

  return (
    <UserProvider>
      <ActionsProvider>
        <ToastContainer />
        <Spin spinning={pageLoading} size="large">
          <Component {...pageProps} />
        </Spin>
      </ActionsProvider>
    </UserProvider>
  )
}

export default MyApp
