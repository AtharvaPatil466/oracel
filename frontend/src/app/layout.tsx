import './globals.css';

export const metadata = {
  title: 'Oracle - Global Intervention Engine',
  description: 'Predictive global monitoring and intervention simulation.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
