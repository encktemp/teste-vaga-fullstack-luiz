import { CssBaseline } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Provedor para os componentes de data/hora do MUI */}
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* CssBaseline normaliza os estilos, o que é bom para o Material UI */}
      <CssBaseline />
      <App />
    </LocalizationProvider>
  </StrictMode>
)
