'use client'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [modo, setModo] = useState('login') // 'login' ou 'cadastro'
  
  const supabase = createClientComponentClient()
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setMensagem('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMensagem('Erro: ' + error.message)
    } else {
      router.push('/')
      router.refresh()
    }

    setLoading(false)
  }

  async function handleCadastro(e) {
    e.preventDefault()
    setLoading(true)
    setMensagem('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      }
    })

    if (error) {
      setMensagem('Erro: ' + error.message)
    } else {
      setMensagem('Cadastro realizado! Verifique seu email para confirmar.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {modo === 'login' ? 'Login' : 'Criar Conta'}
        </h1>

        <form onSubmit={modo === 'login' ? handleLogin : handleCadastro} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Email:</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Senha:</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition disabled:bg-gray-400"
          >
            {loading ? 'Aguarde...' : modo === 'login' ? 'Entrar' : 'Cadastrar'}
          </button>

          {mensagem && (
            <div className={`p-4 rounded-lg text-center text-sm ${
              mensagem.includes('sucesso') || mensagem.includes('Cadastro') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {mensagem}
            </div>
          )}
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setModo(modo === 'login' ? 'cadastro' : 'login')
              setMensagem('')
            }}
            className="text-blue-500 hover:underline text-sm"
          >
            {modo === 'login' ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
          </button>
        </div>
      </div>
    </div>
  )
}