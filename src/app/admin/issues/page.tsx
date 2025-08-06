"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/admin/sidebar"
import TopNav from "@/components/admin/top-nav"
import IssueDetailsModal from "@/components/admin/issue-details-modal"
import { Edit, Trash2, Check } from "lucide-react"
import { feedbackApi, FeedbackStatus } from "@/lib/api/feedback"

// Map API Feedback type to local Issue type for compatibility
interface Issue {
  id: string
  userName: string
  subject: string
  description: string
  priority: "low" | "medium" | "high"
  status: "open" | "in-progress" | "resolved" | "closed"
  dateRaised: string
  category: string
  attachments?: string[]
}

export default function IssuesRaisedPage() {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [issues, setIssues] = useState<Issue[]>([])

  // Load issues on component mount
  useEffect(() => {
    loadIssues()
  }, []) // loadIssues is stable, no need to add as dependency

  const loadIssues = async () => {
    try {
      setLoading(true)
      const feedbacks = await feedbackApi.getAllFeedbacks()

      // Convert API feedback to local issue format
      const issueList: Issue[] = feedbacks.map(feedback => ({
        id: feedback._id,
        userName: feedback.userName,
        subject: feedback.title,
        description: feedback.description,
        priority: feedback.priority as "low" | "medium" | "high",
        status: mapFeedbackStatusToIssueStatus(feedback.status),
        dateRaised: feedback.createdAt,
        category: feedback.category,
        attachments: feedback.attachments
      }))

      setIssues(issueList)
    } catch (error) {
      console.error('Failed to load issues:', error)
    } finally {
      setLoading(false)
    }
  }

  const mapFeedbackStatusToIssueStatus = (status: FeedbackStatus): "open" | "in-progress" | "resolved" | "closed" => {
    switch (status) {
      case 'pending':
      case 'open':
        return 'open'
      case 'in-progress':
        return 'in-progress'
      case 'completed':
      case 'resolved':
        return 'resolved'
      case 'rejected':
      case 'closed':
        return 'closed'
      default:
        return 'open'
    }
  }

  const mapIssueStatusToFeedbackStatus = (status: "open" | "in-progress" | "resolved" | "closed"): FeedbackStatus => {
    switch (status) {
      case 'open':
        return 'open'
      case 'in-progress':
        return 'in-progress'
      case 'resolved':
        return 'resolved'
      case 'closed':
        return 'closed'
      default:
        return 'open'
    }
  }

  const handleViewIssue = (issue: Issue) => {
    setSelectedIssue(issue)
    setIsViewModalOpen(true)
  }

  const handleStatusChange = async (issueId: string, newStatus: Issue["status"]) => {
    try {
      setLoading(true)
      const feedbackStatus = mapIssueStatusToFeedbackStatus(newStatus)
      await feedbackApi.updateStatus(issueId, { status: feedbackStatus })
      await loadIssues() // Reload to reflect changes
      setIsViewModalOpen(false)
    } catch (error) {
      console.error('Failed to update issue status:', error)
      alert('Failed to update issue status. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteIssue = async (issueId: string) => {
    try {
      setLoading(true)
      await feedbackApi.delete(issueId)
      await loadIssues() // Reload to reflect changes
    } catch (error) {
      console.error('Failed to delete issue:', error)
      alert('Failed to delete issue. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResolveIssue = async (issueId: string) => {
    try {
      setLoading(true)
      await feedbackApi.updateStatus(issueId, { status: 'resolved' })
      await loadIssues() // Reload to reflect changes
    } catch (error) {
      console.error('Failed to resolve issue:', error)
      alert('Failed to resolve issue. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }



  const breadcrumbs = [{ label: "Admin Dashboard", href: "/dashboard" }, { label: "Issues Raised" }]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <TopNav title="Issues Raised" breadcrumbs={breadcrumbs} />

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Raised ({issues.length.toString().padStart(1, "0")})
              </h2>
            </div>

            {/* Issues Table */}
            <div className="overflow-x-auto">
              {loading && (
                <div className="flex justify-center items-center py-8">
                  <div className="text-gray-500">Loading...</div>
                </div>
              )}
              {!loading && (
                <table className="w-full">
                  <thead>
                    <tr className="bg-primary-dark">
                      <th className="px-6 py-3 text-left text-sm font-medium text-white">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-white">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                  {issues.map((issue, index) => (
                    <tr key={issue.id} className={index % 2 === 0 ? "bg-row-light" : "bg-white"}>
                      <td className="px-6 py-4 text-sm text-gray-900">{issue.userName}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{formatDate(issue.dateRaised)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleViewIssue(issue)}
                            className="px-3 py-1 bg-primary-dark hover:bg-primary-dark/90 text-white text-xs font-medium rounded transition-colors"
                            title="View Issue"
                          >
                            View Issue
                          </button>
                          <button
                            onClick={() => console.log("Edit issue:", issue.id)}
                            className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm('Are you sure you want to delete this issue?')) {
                                await handleDeleteIssue(issue.id)
                              }
                            }}
                            className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                            title="Delete"
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          {issue.status !== "resolved" && issue.status !== "closed" && (
                            <button
                              onClick={() => handleResolveIssue(issue.id)}
                              className="p-2 rounded bg-green-100 hover:bg-green-200 text-green-700 transition-colors"
                              title="Mark as Resolved"
                              disabled={loading}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {issues.length === 0 && (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                        No issues reported
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Issue Details Modal */}
      <IssueDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        issue={selectedIssue}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}
