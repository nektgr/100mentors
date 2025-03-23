import { AppProps } from 'next/app';
import { AuthProvider } from '../context/AuthContext';
import { PostsProvider } from '../context/PostsContext';
import { SocketProvider } from '../context/SocketContext';
import { Layout } from '../components/layout/Layout';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <SocketProvider>
        <PostsProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </PostsProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default MyApp;
