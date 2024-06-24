import React from 'react';
import { Providers } from './Providers';
import './globals.css';

export const metadata = {
  title: 'Calmedica - Mettre la e-santé à la portée de tous',
  description: 'Calmedica édite des solutions de télésuivi utilisant l\'Intelligence Artificielle pour révolutionner le rapport entre le patient et le système de soin.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (

    <html lang="en">
      <body className="h-screen">
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  )
}
