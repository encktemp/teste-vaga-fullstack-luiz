import { sendPasswordResetEmail } from 'firebase/auth'
import { Mail, X } from 'lucide-react'
import { useState } from 'react'
import { auth } from '../firebase'

interface Props {
  open: boolean
  onClose: () => void
}

const primaryColor = '#115cfa'

export default function ForgotPasswordModal({ open, onClose }: Props) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setMessage('')

    try {
      await sendPasswordResetEmail(auth, email)
      setMessage('Enviamos um link de redefinição para seu e-mail.')
    } catch (err) {
      setError('Erro ao enviar e-mail de redefinição. Verifique o e-mail informado.')
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      style={{ backdropFilter: 'blur(5px)' }}
    >
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md mx-2.5 relative">
        {/* BOTÃO X NO TOPO DIREITO */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors bg-white rounded"
        >
          <X className="h-5 w-5" />
        </button>

        {/* TÍTULO */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Redefina sua senha</h2>

        {/* DESCRIÇÃO */}
        <p className="text-gray-600 text-sm mb-6">
          Informe o e-mail associado à sua conta para receber um link de redefinição de senha.
        </p>

        <form onSubmit={handleReset} className="space-y-4">
          {/* CAMPO EMAIL PADRÃO LOGIN */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="block w-full pl-10 pr-3 py-4 border rounded-md text-gray-900 shadow-sm
                focus:outline-none focus:ring-blue-500 focus:border-blue-500
                sm:text-sm bg-gray-50 placeholder-gray-500"
              />
            </div>
          </div>

          {/* MENSAGENS */}
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {message && <div className="text-green-600 text-sm">{message}</div>}

          {/* BOTÃO ENVIAR */}
          <button
            type="submit"
            className="w-full py-3 text-lg font-bold text-white
             rounded-md border-none cursor-pointer
             transition-all duration-300
             hover:shadow-lg hover:-translate-y-0.5"
            style={{ backgroundColor: primaryColor }}
          >
            Enviar link de redefinição
          </button>
        </form>
      </div>
    </div>
  )
}
