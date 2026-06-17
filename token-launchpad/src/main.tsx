import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SolanaProvider } from './components/SolanaProvider.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import TokenLaunchpad from './pages/token-launchpad.tsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App serves as the root layout
    children: [
      {
        index: true, // Matches the parent path "/" exactly
        element: <App />
      },
      {
        path: "token-launchpad",
        element: <TokenLaunchpad />
      }
    ]
  }
])


createRoot(document.getElementById('root')!).render(
  <SolanaProvider>
    <RouterProvider router={router} />
  </SolanaProvider>
)
