'use client'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function Cadastros() {
  const [cadastros, setCadastros] = useState([])
  const [loading, setLoading] = useState(true)
  
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    carregarCadastros()
  }, [])

  async function carregarCadastros() {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('cadastros')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao carregar:', error)
    } else {
      setCadastros(data)
    }

    setLoading(false)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Meus Cadastros</h1>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              ← Voltar
            </button>
          </div>

          {cadastros.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Nenhum cadastro encontrado.</p>
          ) : (
            <div className="space-y-4">
              {cadastros.map((cadastro) => (
                <div key={cadastro.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-bold text-lg mb-2">{cadastro.nome}</h3>
                  <p className="text-sm text-gray-600"><strong>Endereço:</strong> {cadastro.endereco}</p>
                  <p className="text-sm text-gray-600"><strong>Telefone:</strong> {cadastro.telefone}</p>
                  <p className="text-sm text-gray-600"><strong>Email:</strong> {cadastro.email}</p>
                  {cadastro.observacao && (
                    <p className="text-sm text-gray-600 mt-2"><strong>Obs:</strong> {cadastro.observacao}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    Cadastrado em: {new Date(cadastro.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}