import { Manrope } from 'next/font/google'
import './globals.css'

const manrope = Manrope({ subsets: ['latin'] })

export const metadata = {
  title: 'StudyBuddy - Your Ultimate Study Companion',
  description: 'Personalized tools to boost your preparation for IIT & NEET',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={manrope.className}>{children}</body>
    </html>
  )
}

