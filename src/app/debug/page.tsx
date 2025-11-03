'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function DebugPage() {
  const [status, setStatus] = useState('Loading...')
  const [envVars, setEnvVars] = useState<Record<string, string>>({})
  const [dbTest, setDbTest] = useState<string>('')

  useEffect(() => {
    // Check environment variables
    const env = {
      SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT_SET',
      SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT_SET',
      NODE_ENV: process.env.NODE_ENV || 'NOT_SET'
    }
    setEnvVars(env)

    // Test database connection
    testDatabase()
  }, [])

  const testDatabase = async () => {
    try {
      const { data, error } = await supabase
        .from('hotels')
        .select('id')
        .limit(1)

      if (error) {
        setDbTest(`Database Error: ${error.message}`)
      } else {
        setDbTest(`Database OK: Found ${data?.length || 0} records`)
      }
    } catch (err) {
      setDbTest(`Connection Error: ${err}`)
    }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Deployment Debug Page</h1>

      <h2>Environment Variables:</h2>
      <pre>{JSON.stringify(envVars, null, 2)}</pre>

      <h2>Database Test:</h2>
      <p>{dbTest}</p>

      <h2>Build Info:</h2>
      <p>Timestamp: {new Date().toISOString()}</p>
      <p>Location: {typeof window !== 'undefined' ? window.location.href : 'Server'}</p>
    </div>
  )
}