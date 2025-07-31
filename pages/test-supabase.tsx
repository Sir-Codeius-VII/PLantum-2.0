import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestSupabaseSignUp() {
  useEffect(() => {
    const testSignUp = async () => {
      const { data, error } = await supabase.auth.signUp({
        email: 'testuser@example.com', // use a real email for full test
        password: 'TestPassword123!'
      })
      if (error) {
        console.error('Sign-up error:', error)
      } else {
        console.log('Sign-up success:', data)
      }
    }
    testSignUp()
  }, [])

  return <div>Testing Supabase sign-up. Check the console for results.</div>
}