import { Provider } from 'react-redux';
import '../styles/global.scss'
import 'tailwindcss/tailwind.css'
import { store } from '@/redux/store/store';
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
    <Provider store={store}>
      <ThemeProvider attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  )
}

export default App