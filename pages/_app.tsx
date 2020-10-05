import { AppProps } from 'next/app'
import 'react-toggle/style.css'

import '../styles/index.css'

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
