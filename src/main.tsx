import './index.css'

import { PrimeReactProvider } from 'primereact/api';
import ReactDOM from 'react-dom/client'

import { Login } from './Login.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <PrimeReactProvider>
    <Login />
  </PrimeReactProvider>
)
