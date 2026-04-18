'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAction(_: unknown, formData: FormData) {
  const pin = formData.get('pin') as string
  const correctPin = process.env.HOGAR_PIN

  if (!correctPin) return { error: 'PIN no configurado en el servidor.' }
  if (pin !== correctPin) return { error: 'PIN incorrecto, intenta de nuevo.' }

  const cookieStore = await cookies()
  cookieStore.set('hogar_auth', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    path: '/',
  })

  redirect('/dashboard')
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('hogar_auth')
  redirect('/login')
}
