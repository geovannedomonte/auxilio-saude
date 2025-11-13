'use client'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    telefone: '',
    email: '',
    observacao: ''
  })
  const [mensagem, setMensagem] = useState('')
  
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    verificarUsuario()
  }, [])

  async function verificarUsuario() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    setLoading(false)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMensagem('')

    if (!user) {
      setMensagem('Você precisa estar logado!')
      return
    }

    const { data, error } = await supabase
      .from('cadastros')
      .insert([
        {
          ...formData,
          user_id: user.id
        }
      ])

    if (error) {
      setMensagem('Erro ao cadastrar: ' + error.message)
    } else {
      setMensagem('Cadastro realizado com sucesso! ✅')
      setFormData({
        nome: '',
        endereco: '',
        telefone: '',
        email: '',
        observacao: ''
      })
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.refresh()
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Bem-vindo ao Sistema</h1>
          <p className="text-gray-600 mb-4 text-center">
            Você precisa fazer login para acessar o sistema de cadastro.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Fazer Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Página Auxílio Saúde</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
            >
              Sair
            </button>
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Logado como: <strong>{user.email}</strong>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Nome:</label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Endereço:</label>
              <input
                type="text"
                required
                value={formData.endereco}
                onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Telefone:</label>
              <input
                type="tel"
                required
                value={formData.telefone}
                onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Email:</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Observação:</label>
              <textarea
                value={formData.observacao}
                onChange={(e) => setFormData({...formData, observacao: e.target.value})}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-400 text-white py-3 rounded-lg font-semibold hover:bg-cyan-500 transition"
            >
              Enviar
            </button>

            {mensagem && (
              <div className={`p-4 rounded-lg text-center ${
                mensagem.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {mensagem}
              </div>
            )}
          </form>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/cadastros')}
            className="text-blue-500 hover:underline"
          >
            Ver meus cadastros →
          </button>
        </div>
      </div>
    </div>
  )
}