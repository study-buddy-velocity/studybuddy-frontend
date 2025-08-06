"use client"

import { useState, useEffect, useCallback } from "react"
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
    } catch (err) {
      console.error('Failed to register user:', err)
      toast({ title: 'Error', description: 'Failed to register user' })
    }
  }

  // Token retrieval & user list fetch
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('accessToken')
      // //console.log("Admin page - checking token:", stored ? "Token found" : "No token")
      if (!stored) {
        // //console.log("Admin page - No token found, redirecting to login")
        router.push('/admin-login')
      } else {
        // //console.log("Admin page - Token found, setting token")
        setToken(stored)
      }
    }
  }, [router])

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  })

  const decryptPassword = async (encrypted: string) => {
    try {
      const res = await fetch('/api/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ encryptedPassword: encrypted }),
      })
      if (!res.ok) throw new Error('decrypt')
      const data = await res.json()
      return data.decryptedPassword
    } catch {
      return encrypted
    }
  }

  const fetchUsers = useCallback(async () => {
    try {
      // //console.log("Admin page - Fetching users with token:", token ? "Token present" : "No token")
      const headers = getAuthHeaders()
      // //console.log("Admin page - Auth headers:", headers)

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, { headers })
      // //console.log("Admin page - Users fetch response status:", res.status)

      if (!res.ok) {
        const errorText = await res.text()
        console.error("Admin page - Users fetch failed:", errorText)
        throw new Error(`fetch failed: ${res.status}`)
      }

      const data: User[] = await res.json()
      // //console.log("Admin page - Users data received:", data.length, "users")

      const list = await Promise.all(
        data.map(async u => ({ ...u, decryptedPassword: await decryptPassword(u.password) }))
      )
      setUsers(list)
    } catch (error) {
      console.error("Admin page - Error fetching users:", error)
      toast({ title: 'Error', description: 'Failed to load users' })
    }
  }, [token, getAuthHeaders, toast])

  useEffect(() => {
    if (token) fetchUsers()
  }, [token, fetchUsers])

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
