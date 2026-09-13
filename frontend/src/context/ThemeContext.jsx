import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext(null)
const STORAGE_KEY = 'healthnest_theme'

export function ThemeProvider({ children }) {
  // Always default to 'dark' theme
  const [theme] = useState('dark')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
    try {
      localStorage.setItem(STORAGE_KEY, 'dark')
    } catch {
      /* ignore storage errors */
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
