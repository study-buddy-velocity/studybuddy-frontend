"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import Sidebar from "@/components/admin/sidebar"
import TopNav from "@/components/admin/top-nav"
import AddSubjectModal from "@/components/admin/add-subject-modal"
import AddTopicModal from "@/components/admin/add-topic-modal"
import AddClassModal from "@/components/admin/add-class-modal"
import SubjectDropdown from "@/components/admin/subject-dropdown"
import ClassDropdown from "@/components/admin/class-dropdown"
import { Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Subject {
  id: string
  name: string
  description?: string
}

interface Topic {
  id: string
  name: string
  subjectId: string
  classId?: string
}

interface Class {
  id: string
  name: string
  description?: string
}

export default function SubjectTopicsPage() {
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false)
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false)
  const [isClassModalOpen, setIsClassModalOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedClass, setSelectedClass] = useState("")

  const [subjects, setSubjects] = useState<Subject[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loadingSubjects, setLoadingSubjects] = useState(false)
  const [loadingTopics, setLoadingTopics] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null)
  const [editingClass, setEditingClass] = useState<Class | null>(null)
  const { toast } = useToast()
console.log(loadingSubjects, loadingTopics);

  // Enhanced filtering logic for topics by both subject and class
  const filteredTopics = topics.filter((topic) => {
    const matchesSubject = selectedSubject ? topic.subjectId === selectedSubject : true;
    const matchesClass = selectedClass ? topic.classId === selectedClass : true;
    return matchesSubject && matchesClass;
  });

  const actions = [
  {
    icon: Trash2,
    label: "Delete",
    onClick: async (row: Topic) => {
      try {
        const token = localStorage.getItem("accessToken")
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/topics?subjectId=${row.subjectId}&topicId=${row.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Delete failed")
        setTopics(topics => topics.filter((topic) => topic.id !== row.id))
        toast({ title: "Success", description: "Topic deleted" })
      } catch {
        toast({ title: "Error", description: "Failed to delete topic" })
      }
    },
    variant: "delete" as const,
  },
  {
    icon: null,
    label: "Edit",
    onClick: (row: Topic) => {
      setEditingTopic(row)
      setIsTopicModalOpen(true)
    },
    variant: "edit" as const,
  },
]

  const handleAddSubject = async (data: { name: string; description?: string }) => {
  try {
    setLoadingSubjects(true)
    const token = localStorage.getItem("accessToken")
    let url = `${process.env.NEXT_PUBLIC_API_URL}/admin/subjects`
    let method = "POST"
    const body = JSON.stringify(data)
    if (editingSubject) {
      url = `${process.env.NEXT_PUBLIC_API_URL}/admin/subjects/${editingSubject.id}`
      method = "PUT"
    }
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body,
    })
    if (!res.ok) throw new Error("Subject save failed")
    const subject = await res.json()
    setIsSubjectModalOpen(false)
    setEditingSubject(null)
    await fetchSubjects()
    // Auto-select the new/edited subject
    const newId = subject._id || subject.id
    setSelectedSubject(newId)
    fetchTopics(newId)
    toast({ title: "Success", description: editingSubject ? "Subject updated" : "Subject added" })
  } catch {
    toast({ title: "Error", description: "Failed to save subject" })
  } finally {
    setLoadingSubjects(false)
  }
}

  const handleAddTopic = async (data: { name: string; classId: string; subjectId: string; description?: string }) => {
  try {
    const token = localStorage.getItem("accessToken")
    let url: string, method: string, body: string
    if (editingTopic) {
      // Editing: use legacy endpoint
      url = `${process.env.NEXT_PUBLIC_API_URL}/admin/topics`
      method = "PUT"
      body = JSON.stringify({ ...data, topicId: editingTopic.id, topic: { name: data.name, description: data.description }, subjectId: data.subjectId, classId: data.classId })
    } else {
      // Adding: use RESTful endpoint
      url = `${process.env.NEXT_PUBLIC_API_URL}/admin/subjects/${data.subjectId}/topics`
      method = "POST"
      body = JSON.stringify({ name: data.name, description: data.description, classId: data.classId })
    }
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body,
    })
    if (!res.ok) throw new Error("Topic save failed")
    setIsTopicModalOpen(false)
    setEditingTopic(null)
    fetchTopics(selectedSubject)
    toast({ title: "Success", description: editingTopic ? "Topic updated" : "Topic added" })
  } catch {
    toast({ title: "Error", description: "Failed to save topic" })
  }
}

  const handleAddClass = async () => {
    // Classes are predefined (6th-12th standard), so we just show a message
    setIsClassModalOpen(false)
    setEditingClass(null)
    toast({
      title: "Info",
      description: "Classes are predefined (6th-12th Standard). No changes needed."
    })
  }

  const breadcrumbs = [{ label: "Admin Dashboard", href: "/dashboard" }, { label: "Subject Topics" }]

  // Fetch subjects
const fetchSubjects = async () => {
  setLoadingSubjects(true)
  try {
    const token = localStorage.getItem("accessToken")
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/subjects`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error("Failed to fetch subjects")
    const data = await res.json()
    setSubjects(data.map((s: { _id?: string; id?: string; name: string; description?: string }) => ({ id: s._id || s.id || '', name: s.name, description: s.description })))
  } catch {
    toast({ title: "Error", description: "Could not load subjects" })
  } finally {
    setLoadingSubjects(false)
  }
}

// Fetch topics for subject
const fetchTopics = async (subjectId: string) => {
  setLoadingTopics(true)
  try {
    if (!subjectId) { setTopics([]); setLoadingTopics(false); return }
    const token = localStorage.getItem("accessToken")
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/subjects/${subjectId}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })
    if (!res.ok) throw new Error("Failed to fetch topics")
    const data = await res.json()
    setTopics((data.topics || []).map((t: { _id?: string; id?: string; name: string; classId?: string }) => ({ id: t._id || t.id || '', name: t.name, subjectId: subjectId, classId: t.classId || '' })))
  } catch {
    toast({ title: "Error", description: "Could not load topics" })
  } finally {
    setLoadingTopics(false)
  }
}

// Initialize predefined classes (6th to 12th standard)
const initializeClasses = () => {
  const predefinedClasses: Class[] = [
    { id: "6th", name: "6th Standard", description: "Class 6" },
    { id: "7th", name: "7th Standard", description: "Class 7" },
    { id: "8th", name: "8th Standard", description: "Class 8" },
    { id: "9th", name: "9th Standard", description: "Class 9" },
    { id: "10th", name: "10th Standard", description: "Class 10" },
    { id: "11th", name: "11th Standard", description: "Class 11" },
    { id: "12th", name: "12th Standard", description: "Class 12" },
  ]
  setClasses(predefinedClasses)
}

useEffect(() => {
  fetchSubjects()
  initializeClasses()
}, []) // Functions are stable, no need to add as dependencies

useEffect(() => {
  if (selectedSubject) fetchTopics(selectedSubject)
  else setTopics([])
}, [selectedSubject]) // fetchTopics is stable, no need to add as dependency

// Subject actions
const handleEditSubject = (subject: Subject) => {
  setEditingSubject(subject)
  setIsSubjectModalOpen(true)
}

const handleDeleteSubject = async (subject: Subject) => {
  try {
    setLoadingSubjects(true)
    const token = localStorage.getItem("accessToken")
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/subjects/${subject.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) throw new Error("Delete failed")
    // If the deleted subject was selected, clear selection
    if (selectedSubject === subject.id) {
      setSelectedSubject("")
      setTopics([])
    }
    await fetchSubjects()
    toast({ title: "Success", description: "Subject deleted" })
  } catch {
    toast({ title: "Error", description: "Failed to delete subject" })
  } finally {
    setLoadingSubjects(false)
  }
}

// Class actions
const handleEditClass = (classItem: Class) => {
  setEditingClass(classItem)
  setIsClassModalOpen(true)
}

const handleDeleteClass = async (classItem: Class) => {
  // Classes are predefined (6th-12th standard), so we can't delete them
  console.log(classItem);
  toast({
    title: "Info",
    description: "Cannot delete predefined classes (6th-12th Standard)."
  })
}

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
          <div className="bg-white rounded-lg shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Subject Topics & Classes</h2>
              <div className="flex items-center space-x-3">
                <Button
  onClick={() => { setEditingSubject(null); setIsSubjectModalOpen(true) }}
  className="bg-primary-blue hover:bg-primary-blue/90 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
>
  <Plus className="w-4 h-4 mr-2" />
  Add Subject
</Button>
                <Button
  onClick={() => { setEditingTopic(null); setIsTopicModalOpen(true) }}
  className="bg-primary-dark hover:bg-primary-dark/90 text-white px-4 py-2 rounded-md text-sm font-medium"
>
  Add Topic
</Button>
                <Button
  onClick={() => { setEditingClass(null); setIsClassModalOpen(true) }}
  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
>
  <Plus className="w-4 h-4 mr-2" />
  Add Class
</Button>
              </div>
            </div>

            {/* Subjects Table */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-base font-semibold mb-2">Subjects</h3>
              <div className="overflow-x-auto mb-4">
                <table className="w-full">
                  <thead>
                    <tr className="bg-primary-dark">
                      <th className="px-6 py-3 text-left text-sm font-medium text-white">Subject</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-white">Description</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((subject, idx) => (
                      <tr key={subject.id} className={idx % 2 === 0 ? "bg-row-light" : "bg-white"}>
                        <td className="px-6 py-4 text-sm text-gray-900">{subject.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{subject.description}</td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => handleEditSubject(subject)}
                            className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                            title="Edit"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteSubject(subject)}
                            className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {subjects.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                          No subjects available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Classes Table */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-base font-semibold mb-2">Classes (6th to 12th Standard)</h3>
              <div className="overflow-x-auto mb-4">
                <table className="w-full">
                  <thead>
                    <tr className="bg-green-600">
                      <th className="px-6 py-3 text-left text-sm font-medium text-white">Class</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-white">Description</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map((classItem, idx) => (
                      <tr key={classItem.id} className={idx % 2 === 0 ? "bg-row-light" : "bg-white"}>
                        <td className="px-6 py-4 text-sm text-gray-900">{classItem.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{classItem.description || 'No description'}</td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => handleEditClass(classItem)}
                            className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                            title="Edit"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClass(classItem)}
                            className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {classes.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                          No classes available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Filter Dropdowns for Topics */}
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-base font-semibold mb-4">Filter Topics</h3>
              <div className="flex gap-4 mb-4">
                <div className="flex-1 max-w-xs">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <SubjectDropdown
                    subjects={subjects}
                    selectedSubject={selectedSubject}
                    onSubjectChange={setSelectedSubject}
                    placeholder="All Subjects"
                  />
                </div>
                <div className="flex-1 max-w-xs">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                  <ClassDropdown
                    classes={classes}
                    selectedClass={selectedClass}
                    onClassChange={setSelectedClass}
                    placeholder="All Classes"
                  />
                </div>
              </div>
            </div>

            {/* Topics Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-primary-dark">
                    <th className="px-6 py-3 text-left text-sm font-medium text-white">Topic</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTopics.map((topic, index) => (
  <tr key={topic.id} className={index % 2 === 0 ? "bg-row-light" : "bg-white"}>
    <td className="px-6 py-4 text-sm text-gray-900">{topic.name}</td>
    <td className="px-6 py-4 flex gap-2">
      <button
        onClick={() => actions[1].onClick(topic)}
        className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
        title="Edit"
      >
        Edit
      </button>
      <button
        onClick={() => actions[0].onClick(topic)}
        className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </td>
  </tr>
))}
                  {filteredTopics.length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                        {selectedSubject ? "No topics found for selected subject" : "No topics available"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add Subject Modal */}
      <AddSubjectModal
  isOpen={isSubjectModalOpen}
  onClose={() => { setIsSubjectModalOpen(false); setEditingSubject(null) }}
  onSubmit={handleAddSubject}
  title={editingSubject ? "Edit Subject" : "Add Subject"}
  editSubject={editingSubject}
/>

      {/* Add Topic Modal */}
      <AddTopicModal
  isOpen={isTopicModalOpen}
  onClose={() => { setIsTopicModalOpen(false); setEditingTopic(null) }}
  onSubmit={handleAddTopic}
  subjects={subjects}
  classes={classes}
  title={editingTopic ? "Edit Topic" : "Add Topic"}
  editTopic={editingTopic}
/>

      {/* Add Class Modal */}
      <AddClassModal
        isOpen={isClassModalOpen}
        onClose={() => { setIsClassModalOpen(false); setEditingClass(null) }}
        onSubmit={handleAddClass}
        title={editingClass ? "Edit Class" : "Add Class"}
        editClass={editingClass}
      />
    </div>
  )
}
