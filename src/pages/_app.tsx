import '../styles/global.scss'
import 'tailwindcss/tailwind.css'
import { ThemeProvider } from 'next-themes';
import { ComponentType } from 'react'
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

interface AppProps {
  Component: ComponentType;
  pageProps: any;
}
function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class">
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default App