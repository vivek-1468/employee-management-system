import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import AuthProvider from './context/AuthProvider.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

console.log('main.jsx loaded, rendering app...')

const root = document.getElementById('root')
console.log('Root element:', root)

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)

console.log('App rendered')
