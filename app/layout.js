import './globals.css'

export const metadata = {
  title: 'Sistema Auxílio Saúde',
  description: 'Sistema de cadastro seguro',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}