import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx' // Sesuaikan jika nama file Anda menggunakan huruf kecil
import './index.css' // Baris ini sangat penting agar Tailwind terbaca

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)