import '../styles/global.scss'
import 'tailwindcss/tailwind.css'
import { ComponentType } from 'react'

interface AppProps {
  Component: ComponentType;
  pageProps: any;
}
function App({ Component, pageProps }: AppProps) {
  return (
    <Component {...pageProps} />

  )
}

export default App