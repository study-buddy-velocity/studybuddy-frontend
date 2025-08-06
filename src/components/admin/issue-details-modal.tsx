"use client"

import { X, Calendar, Mail, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

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

interface IssueDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  issue: Issue | null
  onStatusChange?: (issueId: string, status: Issue["status"]) => void
}

export default function IssueDetailsModal({ isOpen, onClose, issue, onStatusChange }: IssueDetailsModalProps) {
  if (!isOpen || !issue) return null

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "low":
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "text-blue-600 bg-blue-100"
      case "in-progress":
        return "text-yellow-600 bg-yellow-100"
      case "resolved":
        return "text-green-600 bg-green-100"
      case "closed":
        return "text-gray-600 bg-gray-100"
      default:
        return "text-gray-600 bg-gray-100"
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-primary-blue" />
            <h2 className="text-lg font-semibold text-gray-900">Issue Details</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Issue Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Reported by</p>
                <p className="text-sm text-gray-900">{issue.userName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">Date Raised</p>
                <p className="text-sm text-gray-900">{formatDate(issue.dateRaised)}</p>
              </div>
            </div>
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Status</p>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}
              >
                {issue.status.charAt(0).toUpperCase() + issue.status.slice(1).replace("-", " ")}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Priority</p>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}
              >
                {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Category</p>
              <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium text-gray-600 bg-gray-100">
                {issue.category}
              </span>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-md">
              <p className="text-gray-900 font-medium">{issue.subject}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-md">
              <p className="text-gray-900 whitespace-pre-wrap">{issue.description}</p>
            </div>
          </div>

          {/* Attachments */}
          {issue.attachments && issue.attachments.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Attachments</label>
              <div className="space-y-2">
                {issue.attachments.map((attachment, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-md">
                    <div className="w-8 h-8 bg-primary-blue rounded flex items-center justify-center">
                      <span className="text-white text-xs font-medium">📎</span>
                    </div>
                    <span className="text-sm text-gray-900">{attachment}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Update Actions */}
          {onStatusChange && (
            <div className="border-t border-gray-200 pt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Update Status</label>
              <div className="flex flex-wrap gap-2">
                {(["open", "in-progress", "resolved", "closed"] as const).map((status) => (
                  <Button
                    key={status}
                    onClick={() => onStatusChange(issue.id, status)}
                    className={`px-4 py-2 text-sm rounded-md transition-colors ${
                      issue.status === status
                        ? "bg-primary-blue text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    disabled={issue.status === status}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <Button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2">
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}
