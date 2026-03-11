import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Welcome from './pages/Welcome'
import TaskFlow from './pages/TaskFlow'
import Dashboard from './pages/Dashboard'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/gorev" element={<TaskFlow />} />
          <Route path="/tablo" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
