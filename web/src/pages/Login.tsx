import { Box } from '@mui/material'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/logo-xyz-white.webp'
import ForgotPasswordModal from '../components/ForgotPasswordModal'
import { auth } from '../firebase'

const primaryColor = '#115cfa'

export default function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [openModal, setOpenModal] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('') // Limpa erros anteriores

    try {
      await signInWithEmailAndPassword(auth, email, password)
      // Redireciona para o dashboard após o login bem-sucedido
      navigate('/')
    } catch (err) {
      console.error('Erro ao entrar:', err)
      let errorMessage = 'Ocorreu um erro ao tentar entrar. Tente novamente.'

      // Verificação de tipo para garantir que 'err' é um erro do Firebase
      if (err instanceof Error && 'code' in err) {
        const firebaseError = err as { code: string }
        if (firebaseError.code === 'auth/invalid-credential') {
          errorMessage = 'E-mail ou senha inválidos.'
        }
      }

      setError(errorMessage)
    }
  }

  const [showPassword, setShowPassword] = useState(false)
  const passwordInputRef = useRef<HTMLInputElement>(null)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-purple-700 to-blue-700 px-4">
      <div className="mb-8">
        <img src={logo} alt="XYZ Logo" className="h-12 mx-auto mt-4" />
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Acessar Conta</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" aria-hidden="true" />
              </div>
              <input
                className="block w-full pl-10 pr-3 py-4 border rounded-md text-gray-900 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 placeholder-gray-500"
                type="email"
                placeholder="E-mail"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" aria-hidden="true" />
              </div>
              <input
                className="block w-full pl-10 pr-12 py-4 border rounded-md text-gray-900 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50 placeholder-gray-500"
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
                id="password"
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
                    <Eye
                      className="h-5 w-5 text-gray-500 cursor-pointer "
                      aria-label="Ocultar senha"
                    />
                  ) : (
                    <EyeOff
                      className="h-5 w-5 text-gray-500 cursor-pointer"
                      aria-label="Exibir senha"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-gray-700 text-sm">Lembrar-me</span>
            </label>
            <Link
              to="#"
              onClick={handleOpenModal}
              className="text-blue-500 text-sm underline underline-offset-4"
            >
              Recuperar senha?
            </Link>
          </div>
          {error && <div className="text-red-500">{error}</div>}
          <button
            type="submit"
            className="w-full py-3 text-lg font-bold text-white
             bg-blue-500 hover:bg-blue-700
             rounded-md border-none cursor-pointer
             transition-all duration-300
             hover:shadow-lg hover:-translate-y-0.5"
            style={{ backgroundColor: primaryColor }}
          >
            Entrar
          </button>
        </form>
        <div className="mt-4 text-center">
          <span className="text-gray-600 font-semibold">Novo na XYZ?</span>
          <Link
            to="/register"
            className="ml-1 font-bold no-underline"
            style={{ color: primaryColor }}
          >
            CRIAR CONTA
          </Link>
        </div>
      </div>
      <Box textAlign="center" color="white" mt={4}>
        Teste Desenvolvedor Full Stack -{' '}
        <a href="https://luizmoeller.lcmsistemas.com.br/" target="_blank" rel="noopener noreferrer">
          <b style={{ color: 'white' }}>Luiz Möeller</b>
        </a>
      </Box>
      <ForgotPasswordModal open={openModal} onClose={handleCloseModal} />
    </div>
  )
}
