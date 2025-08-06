"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DebugResponse {
  success: boolean
  [key: string]: unknown
}

export default function AdminDebugPage() {
  const [mounted, setMounted] = useState(false)
  const [results, setResults] = useState<{ [key: string]: DebugResponse }>({})
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({})

  const getAuthHeaders = (): Record<string, string> => {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') {
      return {
        'Content-Type': 'application/json'
      }
    }

    const token = localStorage.getItem('accessToken')
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    return headers
  }

  const testEndpoint = async (name: string, url: string, requiresAuth: boolean = true) => {
    setLoading(prev => ({ ...prev, [name]: true }))
    
    try {
      const headers = requiresAuth ? getAuthHeaders() : { 'Content-Type': 'application/json' }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        headers
      })
      
      const data = await response.json()
      setResults(prev => ({
        ...prev,
        [name]: {
          success: response.ok,
          status: response.status,
          statusText: response.statusText,
          data
        }
      }))
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [name]: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }))
    } finally {
      setLoading(prev => ({ ...prev, [name]: false }))
    }
  }

  const tests = [
    { name: 'No Auth Test', url: '/admin-debug/no-auth-test', requiresAuth: false },
    { name: 'Token Info', url: '/admin-debug/token-info', requiresAuth: true },
    { name: 'Users Info', url: '/admin-debug/users-info', requiresAuth: false },
    { name: 'Admin Test', url: '/admin-debug/admin-test', requiresAuth: true },
    { name: 'Get Users (Admin)', url: '/users', requiresAuth: true },
    { name: 'Get Subjects (Admin)', url: '/admin/subjects', requiresAuth: true },
  ]

  const runAllTests = async () => {
    for (const test of tests) {
      await testEndpoint(test.name, test.url, test.requiresAuth)
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  // Ensure component only renders on client side
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything during SSR
  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Debug Dashboard</h1>
          <p className="text-gray-600">Test admin API endpoints and authentication</p>
        </div>

        <div className="mb-6">
          <Button onClick={runAllTests} className="mr-4">
            Run All Tests
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              setResults({})
              setLoading({})
            }}
          >
            Clear Results
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tests.map((test) => (
            <Card key={test.name} className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{test.name}</CardTitle>
                <p className="text-sm text-gray-500">{test.url}</p>
                <p className="text-xs text-gray-400">
                  {test.requiresAuth ? '🔒 Requires Auth' : '🔓 No Auth'}
                </p>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => testEndpoint(test.name, test.url, test.requiresAuth)}
                  disabled={loading[test.name]}
                  className="w-full mb-3"
                  size="sm"
                >
                  {loading[test.name] ? 'Testing...' : 'Test'}
                </Button>
                
                {results[test.name] && (
                  <div className="mt-3">
                    <div className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mb-2 ${
                      results[test.name].success 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {results[test.name].success ? '✅ Success' : '❌ Failed'}
                      {results[test.name].status ? ` (${String(results[test.name].status)})` : ''}
                    </div>
                    
                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                      {JSON.stringify(results[test.name], null, 2)}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Current Token Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <strong>Token exists:</strong> {localStorage.getItem('accessToken') ? 'Yes' : 'No'}
              </div>
              {localStorage.getItem('accessToken') && (
                <div>
                  <strong>Token preview:</strong> {localStorage.getItem('accessToken')?.substring(0, 50)}...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
