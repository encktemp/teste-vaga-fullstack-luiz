import { type User, onAuthStateChanged } from 'firebase/auth'
import { type ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { auth } from '../firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true })

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Ouve as mudanças de estado da autenticação (login/logout)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>{!loading && children}</AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
