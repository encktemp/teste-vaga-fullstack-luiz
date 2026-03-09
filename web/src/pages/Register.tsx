import { Box } from '@mui/material'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo-xyz-white.webp'
import { auth } from '../firebase'

const primaryColor = '#115cfa'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const passwordInputRef = useRef<HTMLInputElement>(null)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      navigate('/')
    } catch (err) {
      console.error('Erro ao cadastrar:', err)
      let errorMessage = 'Ocorreu um erro ao tentar cadastrar. Tente novamente.'

      if (err instanceof Error && 'code' in err) {
        const firebaseError = err as { code: string }

        if (firebaseError.code === 'auth/email-already-in-use') {
          errorMessage = 'Este e-mail já está em uso.'
        } else if (firebaseError.code === 'auth/weak-password') {
          errorMessage = 'A senha deve ter pelo menos 6 caracteres.'
        }
      }

      setError(errorMessage)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-blue-700 px-4">
      {/* Logo */}
      <div className="mb-8">
        <img src={logo} alt="XYZ Logo" className="h-12 mx-auto" />
      </div>

      {/* Card */}
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md mt-15">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Criar Conta</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="email"
              placeholder="E-mail"
              className="block w-full pl-10 pr-3 py-4 border rounded-md text-gray-900 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 placeholder-gray-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Senha */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-500" />
            </div>

            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
              className="block w-full pl-10 pr-12 py-4 border rounded-md text-gray-900 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 placeholder-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              ref={passwordInputRef}
            />

            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button
                type="button"
                className="focus:outline-none bg-transparent border-none p-0"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <Eye className="h-5 w-5 text-gray-500 cursor-pointer" />
                ) : (
                  <EyeOff className="h-5 w-5 text-gray-500 cursor-pointer" />
                )}
              </button>
            </div>
          </div>

          {/* Botão */}
          <button
            type="submit"
            className="w-full py-3 text-lg font-bold text-white
             bg-blue-500 hover:bg-blue-700
             rounded-md border-none cursor-pointer
             transition-all duration-300
             hover:shadow-lg hover:-translate-y-0.5"
            style={{ backgroundColor: primaryColor }}
          >
            Criar Conta
          </button>
        </form>

        {/* Link Login */}
        <div className="mt-4 text-center">
          <span className="text-gray-600 font-semibold">Já possui conta?</span>
          <Link to="/login" className="ml-1 font-bold no-underline" style={{ color: primaryColor }}>
            ENTRAR
          </Link>
        </div>
      </div>
      <Box textAlign="center" color="white" mt={4}>
        Teste Desenvolvedor Full Stack -{' '}
        <a href="https://luizmoeller.lcmsistemas.com.br/" target="_blank" rel="noopener noreferrer">
          <b style={{ color: 'white' }}>Luiz Möeller</b>
        </a>
      </Box>
    </div>
  )
}
