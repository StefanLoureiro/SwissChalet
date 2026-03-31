import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import GlobalStyle from './styles/GlobalStyle'
import Home from './pages/Home'
import About from './pages/About'
import Activities from './pages/Activities'
import Chalet from './pages/Chalet'
import Dashboard from './pages/Dashboard'
import Faqs from './pages/Faqs'
import Terms from './pages/Terms'
import Footer from './components/Footer'

function AppContent() {
  const location = useLocation()
  const isDashboard = location.pathname.startsWith('/dashboard')
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/chalets" element={<Chalet />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:tab" element={<Dashboard />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
      {!isDashboard && <Footer />}
    </>
  )
}

function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </>
  )
}

export default App
