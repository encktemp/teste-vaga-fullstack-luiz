import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function PrivateRoute() {
  const { user } = useAuth()

  // Se tiver usuário, renderiza a rota filha (Outlet). Se não, manda pro login.
  return user ? <Outlet /> : <Navigate to="/login" />
}
