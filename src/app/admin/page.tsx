"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/admin/sidebar"
import TopNav from "@/components/admin/top-nav"
import DataTable from "@/components/admin/data-table"
import AddUserModal from "@/components/admin/add-user-modal"
import { Eye, ClipboardCopy, Trash2 } from "lucide-react"
import StudentDetailsModal from "@/components/admin/student-details-modal"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface User {
  _id: string
  email: string
  password: string
  decryptedPassword?: string
}

export default function AdminDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [token, setToken] = useState<string | null>(null)
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [decryptionCache, setDecryptionCache] = useState<Map<string, string>>(new Map())

  const router = useRouter()
  const { toast } = useToast()

  const [selectedUserForDetails, setSelectedUserForDetails] = useState<User | null>(null)
  const [isUserDetailsModalOpen, setIsUserDetailsModalOpen] = useState(false)

  const columns = [
    { key: "email", label: "Mail" },
    { key: "decryptedPassword", label: "Password" },
  ]

  const copyUserDetails = (email: string, password: string) => {
    navigator.clipboard.writeText(`Email: ${email}\nPassword: ${password}`)
    toast({ title: "Copied!", description: "User details copied to clipboard" })
  }

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users?id=${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      })
      if (!response.ok) throw new Error('Failed to delete user')
      setUsers(users.filter(user => user._id !== userId))
      toast({ title: 'Success', description: 'User deleted successfully' })
      // Refresh the user list to ensure consistency
      setTimeout(() => refreshUsers(), 1000)
    } catch (err) {
      console.error('Failed to delete user:', err)
      toast({ title: 'Error', description: 'Could not delete user' })
    }
  }

  const actions = [
    {
      icon: Eye,
      label: 'View Details',
      onClick: (row: User) => {
        setSelectedUserForDetails(row)
        setIsUserDetailsModalOpen(true)
      },
      variant: 'view' as const,
    },
    {
      icon: ClipboardCopy,
      label: 'Copy',
      onClick: (row: User) => copyUserDetails(row.email, row.decryptedPassword || row.password),
      variant: 'edit' as const,
    },
    {
      icon: Trash2,
      label: 'Delete',
      onClick: (row: User) => deleteUser(row._id),
      variant: 'delete' as const,
    },
  ]

  const refreshUsers = () => {
    // Force a page reload to refresh data
    window.location.reload()
  }

  const handleAddUser = async ({ email, password }: { email: string; password: string }) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ email, password }),
      })
      if (!response.ok) throw new Error('Registration failed')
      const newUser = await response.json()
      const decryptedPassword = await decryptPassword(password)
      setUsers([...users, { _id: newUser._id, email, password, decryptedPassword }])
      toast({ title: 'Success', description: 'User registered successfully' })
      // Refresh the user list to ensure consistency
      setTimeout(() => refreshUsers(), 1000)
    } catch (err) {
      console.error('Failed to register user:', err)
      toast({ title: 'Error', description: 'Failed to register user' })
    }
  }

  // Token retrieval and user fetching
  useEffect(() => {
    const loadData = async () => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('accessToken')
        if (!stored) {
          router.push('/admin-login')
          return
        }

        setToken(stored)
        setIsLoadingUsers(true)

        try {
          const headers = {
            Authorization: `Bearer ${stored}`,
            'Content-Type': 'application/json',
          }

          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
            headers,
            cache: 'no-cache'
          })

          if (!res.ok) {
            throw new Error(`fetch failed: ${res.status}`)
          }

          const data: User[] = await res.json()
          console.log("Fetched users data:", data)

          const list = await Promise.all(
            data.map(async u => ({ ...u, decryptedPassword: await decryptPassword(u.password) }))
          )

          setUsers(list)
          console.log("Users state set to:", list.length, "users")
        } catch (error) {
          console.error("Error loading users:", error)
          toast({ title: 'Error', description: 'Failed to load users' })
        } finally {
          setIsLoadingUsers(false)
        }
      }
    }

    loadData()
  }, [router])

  const getAuthHeaders = useCallback(() => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }), [token])

  const decryptPassword = async (encrypted: string) => {
    // Return early if no encrypted password or empty string
    if (!encrypted || encrypted.trim() === '') {
      return encrypted
    }

    // Check cache first
    if (decryptionCache.has(encrypted)) {
      return decryptionCache.get(encrypted)!
    }

    try {
      const res = await fetch('/api/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encryptedPassword: encrypted }),
      })
      if (!res.ok) throw new Error('decrypt')
      const data = await res.json()

      // Cache the result
      setDecryptionCache(prev => new Map(prev).set(encrypted, data.decryptedPassword))

      return data.decryptedPassword
    } catch (error) {
      console.error('Decryption failed for:', encrypted, error)
      return encrypted
    }
  }





  // Debug log for users state changes
  useEffect(() => {
    console.log("Users state changed:", users.length, "users") // Debug log
  }, [users])

  // Debug log for loading state changes
  useEffect(() => {
    console.log("Loading state changed:", isLoadingUsers) // Debug log
  }, [isLoadingUsers])

  const [page, setPage] = useState(1)
  const pageSize = 10

  const breadcrumbs = [{ label: "Admin Dashboard", href: "/dashboard" }, { label: "Student Details" }]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <TopNav title="Admin Dashboard" breadcrumbs={breadcrumbs} />

        {/* Content */}
        <div className="flex-1 p-6">
          <DataTable
            title="Students"
            count={users.length}
            columns={columns}
            data={users as unknown as Record<string, unknown>[]}
            actions={actions as unknown as Array<{ icon: React.ComponentType<{ className?: string }>; label: string; onClick: (row: Record<string, unknown>) => void; variant?: "default" | "edit" | "delete" | "view" }>}
            onAddNew={() => setIsModalOpen(true)}
            addButtonLabel="Add User"
            page={page}
            pageSize={pageSize}
            onPageChange={setPage}
            isLoading={isLoadingUsers}
          />
        </div>
      </div>

      {/* Add User Modal */}
      <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddUser} />

      {/* Student Details Modal */}
      <StudentDetailsModal
        isOpen={isUserDetailsModalOpen}
        onClose={() => setIsUserDetailsModalOpen(false)}
        student={selectedUserForDetails}
      />

      <Toaster />
    </div>
  )
}
