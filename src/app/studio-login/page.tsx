'use client'

import { useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function StudioLoginForm() {
  const [passphrase, setPassphrase] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/studio'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/studio-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passphrase }),
      })

      if (res.ok) {
        router.push(from)
      } else {
        setError('Incorrect passphrase. Please try again.')
        setPassphrase('')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-[var(--color-oyster)] px-4'>
      <div className='w-full max-w-sm rounded-2xl bg-white px-8 py-10 shadow-lg'>
        <div className='mb-8 flex flex-col items-center gap-3'>
          <div className='h-1 w-12 rounded bg-primary-red' />
          <h1 className='font-[family-name:var(--font-hanken)] text-2xl font-bold text-[var(--color-primary-dark)]'>
            Studio Access
          </h1>
          <p className='text-center text-sm text-slate-500'>
            Enter the passphrase to access the CMS.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <div className='flex flex-col gap-1.5'>
            <label
              htmlFor='passphrase'
              className='text-sm font-semibold text-slate-600'
            >
              Passphrase
            </label>
            <input
              id='passphrase'
              type='password'
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              required
              autoFocus
              autoComplete='current-password'
              placeholder='Enter passphrase'
              className='rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none ring-0 transition focus:border-primary-red focus:ring-1 focus:ring-primary-red'
            />
          </div>

          {error && (
            <p className='rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600'>
              {error}
            </p>
          )}

          <button
            type='submit'
            disabled={loading || !passphrase}
            className='mt-2 rounded-lg bg-primary-red px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {loading ? 'Verifying…' : 'Enter Studio'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function StudioLoginPage() {
  return (
    <Suspense>
      <StudioLoginForm />
    </Suspense>
  )
}
