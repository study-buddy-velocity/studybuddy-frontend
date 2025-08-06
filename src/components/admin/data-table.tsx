"use client"

import type React from "react"
import { Button } from "@/components/ui/button"

interface TableColumn {
  key: string
  label: string
  width?: string
}

interface TableAction {
  icon: React.ComponentType<{ className?: string }>
  label: string
  onClick: (row: Record<string, unknown>) => void
  variant?: "default" | "edit" | "delete" | "view"
}

interface DataTableProps {
  title: string
  count: number
  columns: TableColumn[]
  data: Record<string, unknown>[]
  actions?: TableAction[]
  onAddNew?: () => void
  addButtonLabel?: string
  className?: string
  page?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  isLoading?: boolean
}

export default function DataTable({
  title,
  count,
  columns,
  data,
  actions = [],
  onAddNew,
  addButtonLabel = "Add New",
  className = "",
  page = 1,
  pageSize = 10,
  onPageChange,
  isLoading = false,
}: DataTableProps) {
  const getActionButtonClass = (variant = "default") => {
    switch (variant) {
      case "view":
        return "bg-primary-dark hover:bg-primary-dark/90 text-white"
      case "edit":
        return "bg-gray-100 hover:bg-gray-200 text-gray-700"
      case "delete":
        return "bg-gray-100 hover:bg-gray-200 text-gray-700"
      default:
        return "bg-primary-blue hover:bg-primary-blue/90 text-white"
    }
  }

  // Pagination logic
  const totalPages = Math.ceil(count / pageSize)
  const paginatedData = data.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className={`bg-white rounded-lg shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          {title} ({count.toString().padStart(2, "0")})
        </h2>
        {onAddNew && (
          <Button
            onClick={onAddNew}
            className="bg-primary-dark hover:bg-primary-dark/90 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            {addButtonLabel}
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary-dark">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-sm font-medium text-white ${column.width || ""}`}
                >
                  {column.label}
                </th>
              ))}
              {actions.length > 0 && <th className="px-6 py-3 text-left text-sm font-medium text-white">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="text-center py-8 text-primary-blue">Loading...</td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr key={index} className={index % 2 === 0 ? "bg-row-light" : "bg-white"}>
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 text-sm text-gray-900">
                      {String(row[column.key] ?? '')}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {actions.map((action, actionIndex) => {
                          const Icon = action.icon
                          return (
                            <button
                              key={actionIndex}
                              onClick={() => action.onClick(row)}
                              className={`p-2 rounded text-xs font-medium transition-colors ${getActionButtonClass(action.variant)}`}
                              title={action.label}
                            >
                              <Icon className="w-4 h-4" />
                            </button>
                          )
                        })}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (actions.length > 0 ? 1 : 0)} className="text-center py-8 text-primary-blue">No data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 py-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPageChange && onPageChange(page - 1)}
            disabled={page === 1}
          >
            Prev
          </Button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => onPageChange && onPageChange(i + 1)}
              className={`w-8 h-8 rounded-full border-2 mx-1 text-sm font-semibold ${page === i + 1 ? 'border-primary-blue text-primary-blue' : 'border-gray-200 text-gray-500 hover:border-primary-blue hover:text-primary-blue'}`}
            >
              {i + 1}
            </button>
          ))}
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPageChange && onPageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
