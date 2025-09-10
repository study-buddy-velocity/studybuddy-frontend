"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/admin/sidebar"
import TopNav from "@/components/admin/top-nav"
import AddQuestionModal from "@/components/admin/add-question-modal"
import UploadQuestionsModal from "@/components/admin/upload-questions-modal"
import SubjectDropdown from "@/components/admin/subject-dropdown"
import ClassDropdown from "@/components/admin/class-dropdown"
import { Trash2, Upload, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import QuestionDetailsModal from "@/components/admin/question-details-modal"
import { subjectApi, quizApi, CreateQuizData } from "@/lib/api/quiz"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"

// Map API types to local types for compatibility with existing components
interface LocalSubject {
  id: string
  name: string
  description?: string
}

interface LocalTopic {
  id: string
  name: string
  subjectId: string
  classId?: string
}

interface LocalClass {
  id: string
  name: string
  description?: string
}

interface LocalQuestion {
  id: string
  question: string
  subjectId: string
  topicId: string
  classId?: string
  options: Array<{
    id: string
    text: string
    isCorrect: boolean
  }>
  explanation?: string
}

export default function QuizQuestionsPage() {
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("")
  const [selectedQuestion, setSelectedQuestion] = useState<LocalQuestion | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<LocalQuestion | null>(null)
  const [loading, setLoading] = useState(false)

  const [subjects, setSubjects] = useState<LocalSubject[]>([])
  const [topics, setTopics] = useState<LocalTopic[]>([])
  const [questions, setQuestions] = useState<LocalQuestion[]>([])
  const [classes, setClasses] = useState<LocalClass[]>([])

  // Load subjects, classes and questions on component mount
  useEffect(() => {
    loadSubjects()
    loadClasses()
    loadQuestions()
  }, []) // Functions are stable, no need to add as dependencies

  // Load questions when subject, class, or topic filter changes
  useEffect(() => {
    loadQuestions()
  }, [selectedSubject, selectedClass, selectedTopic]) // loadQuestions is stable, no need to add as dependency

  const loadSubjects = async () => {
    try {
      setLoading(true)
      const apiSubjects = await subjectApi.getAll()
      const localSubjects: LocalSubject[] = apiSubjects.map(subject => ({
        id: subject._id,
        name: subject.name,
        description: subject.description
      }))
      setSubjects(localSubjects)

      // Extract all topics from subjects
      const allTopics: LocalTopic[] = []
      apiSubjects.forEach(subject => {
        subject.topics.forEach(topic => {
          allTopics.push({
            id: topic._id,
            name: topic.name,
            subjectId: subject._id,
            classId: (topic as any).classId
          })
        })
      })
      setTopics(allTopics)
    } catch (error) {
      console.error('Failed to load subjects:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadClasses = () => {
    const predefinedClasses: LocalClass[] = [
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

  const loadQuestions = async () => {
    try {
      setLoading(true)
      const filter: { subjectId?: string; topicId?: string; classId?: string } = {}
      if (selectedSubject) filter.subjectId = selectedSubject
      if (selectedTopic) filter.topicId = selectedTopic
      if (selectedClass) filter.classId = selectedClass

      const apiQuestions = await quizApi.getAll(filter)
      const localQuestions: LocalQuestion[] = apiQuestions.map(quiz => ({
        id: quiz._id,
        question: quiz.question,
        subjectId: quiz.subjectId,
        topicId: quiz.topicId,
        classId: (quiz as any).classId,
        options: quiz.options.map((option, index) => ({
          id: index.toString(),
          text: option.text,
          isCorrect: option.isCorrect
        })),
        explanation: quiz.explanation
      }))
      setQuestions(localQuestions)
    } catch (error) {
      console.error('Failed to load questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTopics = selectedSubject
  ? topics.filter((topic) => topic.subjectId === selectedSubject && (!selectedClass || !topic.classId || topic.classId === selectedClass))
  : topics

  const filteredQuestions = questions.filter((question) => {
    if (selectedSubject && question.subjectId !== selectedSubject) return false
    if (selectedTopic && question.topicId !== selectedTopic) return false
    return true
  })

  const handleAddQuestion = async (data: {
    question: string
    classId: string
    subjectId: string
    topicId: string
    options: Array<{ id: string; text: string; isCorrect: boolean }>
    explanation?: string
  }) => {
    try {
      setLoading(true)

      const createData: CreateQuizData = {
        question: data.question,
        subjectId: data.subjectId,
        topicId: data.topicId,
        options: data.options.map(option => ({
          text: option.text,
          isCorrect: option.isCorrect
        })),
        explanation: data.explanation,
        classId: data.classId
      }

      if (editingQuestion) {
        // Update existing question
        await quizApi.update(editingQuestion.id, createData)
        setEditingQuestion(null)
      } else {
        // Add new question
        await quizApi.create(createData)
      }

      // Reload questions to reflect changes
      await loadQuestions()
    } catch (error) {
      console.error('Failed to save question:', error)
      alert('Failed to save question. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleUploadQuestions = async (data: { file: File; classId: string; subjectId: string; topicId: string }) => {
    setLoading(true);
    try {
      // Parse CSV file
      const csvText = await data.file.text();
      const lines = csvText.replace(/\r/g, '').split('\n').filter(line => line.trim() !== '');

      if (lines.length < 2) {
        alert('CSV file must contain at least a header row and one data row.');
        return;
      }

      // Function to parse CSV line properly handling commas within quoted fields
      const parseCSVLine = (line: string): string[] => {
        const result = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
          const char = line[i];

          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        result.push(current.trim());
        return result;
      };

      // Parse header to understand CSV structure
      // Normalize headers for robustness (trim, remove quotes, lowercase)
      let header = parseCSVLine(lines[0]).map(h => h.replace(/"/g, '').trim());
      if (header.length && header[0].charCodeAt(0) === 0xFEFF) {
        header[0] = header[0].slice(1);
      }
      header = header.map(h => h.toLowerCase());
      const expectedHeaders = ['question', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer', 'explanation'];

      console.log('Parsed header:', header);
      console.log('Expected headers:', expectedHeaders);

      // Validate headers
      const missingHeaders = expectedHeaders.filter(h => !header.includes(h));
      if (missingHeaders.length > 0) {
        alert(`CSV file is missing required columns: ${missingHeaders.join(', ')}`);
        return;
      }

      // Parse data rows with special handling for numeric values containing commas (e.g. 3,402)
      const questions = [] as any[]
      for (let i = 1; i < lines.length; i++) {
        const rawRow = parseCSVLine(lines[i]).map(cell => cell.replace(/"/g, ''))

        // If the row has more columns than expected, it's likely because a number such as 3,402
        // was split by the comma thousands-separator. We attempt to intelligently merge such
        // fragments so that the row aligns again with the expected header count.
        const row: string[] = []
        let pointer = 0
        for (let hIndex = 0; hIndex < expectedHeaders.length; hIndex++) {
          const headerName = expectedHeaders[hIndex]

          // For option columns we might need to join fragments (e.g. ["3", "402"] -> "3,402")
          if (headerName.startsWith('option_')) {
            // Start with the current fragment
            let value = rawRow[pointer] ?? ''
            // Merge subsequent purely numeric 3-digit fragments that are likely part of a thousands-separated number
            while (pointer + 1 < rawRow.length && /^\d{3}$/.test(rawRow[pointer + 1])) {
              value += `,${rawRow[pointer + 1]}`
              pointer++
            }
            row.push(value.trim())
            pointer++
          } else {
            // Non-option columns – just take the next fragment
            row.push((rawRow[pointer] ?? '').trim())
            pointer++
          }
        }

        console.log(`Row ${i} parsed + aligned:`, row)

        // If after alignment the row still doesn't have the required number of columns, skip it
        if (row.length < expectedHeaders.length) {
          console.log(`Row ${i} skipped: insufficient columns (${row.length} < ${expectedHeaders.length})`);
          continue;
        }

        const questionText = row[header.indexOf('question')];
        const optionA = row[header.indexOf('option_a')];
        const optionB = row[header.indexOf('option_b')];
        const optionC = row[header.indexOf('option_c')];
        const optionD = row[header.indexOf('option_d')];
        const correctAnswer = row[header.indexOf('correct_answer')].toUpperCase().trim();
        const explanation = row[header.indexOf('explanation')] || '';

        console.log(`Row ${i} data:`, {
          question: questionText,
          optionA, optionB, optionC, optionD,
          correctAnswer,
          explanation
        });

        // Validate required fields
        if (!questionText || !optionA || !optionB || !optionC || !optionD || !correctAnswer) {
          console.log(`Row ${i} skipped: missing required fields`);
          continue;
        }

        // Validate correct answer
        if (!['A', 'B', 'C', 'D'].includes(correctAnswer)) {
          console.log(`Row ${i} skipped: invalid correct answer "${correctAnswer}"`);
          continue;
        }

        const questionData = {
          question: questionText,
          options: [
            { text: optionA, isCorrect: correctAnswer === 'A' },
            { text: optionB, isCorrect: correctAnswer === 'B' },
            { text: optionC, isCorrect: correctAnswer === 'C' },
            { text: optionD, isCorrect: correctAnswer === 'D' }
          ],
          subjectId: data.subjectId,
          topicId: data.topicId,
          classId: data.classId,
          explanation: explanation,
          difficulty: 1,
          type: 'multiple-choice'
        };

        console.log(`Row ${i} question data:`, questionData);
        questions.push(questionData);
      }

      if (questions.length === 0) {
        alert('No valid questions found in CSV file.');
        return;
      }

      // Send to backend
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/quizzes/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ questions })
      });

      const result = await response.json();

      if (response.ok) {
        if (result.success) {
          alert(`Successfully uploaded ${result.created} questions!`);
        } else {
          alert(`Uploaded ${result.created} questions with ${result.errors.length} errors:\n${result.errors.slice(0, 5).join('\n')}`);
        }
        await loadQuestions(); // Refresh the questions list
      } else {
        throw new Error(result.message || 'Failed to upload questions');
      }
    } catch (error) {
      console.error('Failed to upload questions:', error);
      alert('Failed to upload questions. Please check the CSV format and try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      setLoading(true)
      await quizApi.delete(questionId)
      await loadQuestions()
    } catch (error) {
      console.error('Failed to delete question:', error)
      alert('Failed to delete question. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleQuestionClick = (question: LocalQuestion) => {
    setSelectedQuestion(question)
    setIsViewModalOpen(true)
  }

  const handleEditQuestion = () => {
    if (selectedQuestion) {
      setEditingQuestion(selectedQuestion)
      setIsViewModalOpen(false)
      setIsAddQuestionModalOpen(true)
    }
  }

  const handleCloseAddModal = () => {
    setIsAddQuestionModalOpen(false)
    setEditingQuestion(null)
  }

  const breadcrumbs = [{ label: "Admin Dashboard", href: "/dashboard" }, { label: "Quiz Questions" }]

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
              <h2 className="text-lg font-semibold text-gray-900">Quiz Questions</h2>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => setIsAddQuestionModalOpen(true)}
                  className="bg-primary-blue hover:bg-primary-blue/90 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
                <Button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="bg-primary-dark hover:bg-primary-dark/90 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Questions
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="p-6 border-b border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <SubjectDropdown
                    subjects={subjects}
                    selectedSubject={selectedSubject}
                    onSubjectChange={(subjectId) => {
                      setSelectedSubject(subjectId)
                      setSelectedTopic("") // Reset topic when subject changes
                    }}
                    placeholder="All Subjects"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                  <ClassDropdown
                    classes={classes}
                    selectedClass={selectedClass}
                    onClassChange={setSelectedClass}
                    placeholder="All Classes"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                  <div className="relative">
                    <select
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent"
                      disabled={!selectedSubject}
                    >
                      <option value="">All Topics</option>
                      {filteredTopics.map((topic) => (
                        <option key={topic.id} value={topic.id}>
                          {topic.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions Table */}
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
                      <th className="px-6 py-3 text-left text-sm font-medium text-white">Question</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                  {filteredQuestions.map((question, index) => (
                    <tr
                      key={question.id}
                      className={`${index % 2 === 0 ? "bg-row-light" : "bg-white"} hover:bg-blue-50 cursor-pointer transition-colors`}
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 prose max-w-none" onClick={() => handleQuestionClick(question)}>
                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                          {question.question}
                        </ReactMarkdown>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={async (e) => {
                            e.stopPropagation()
                            if (confirm('Are you sure you want to delete this question?')) {
                              await handleDeleteQuestion(question.id)
                            }
                          }}
                          className="p-2 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                          title="Delete"
                          disabled={loading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredQuestions.length === 0 && (
                    <tr>
                      <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                        {selectedSubject || selectedTopic
                          ? "No questions found for selected filters"
                          : "No questions available"}
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

      {/* Add Question Modal */}
      <AddQuestionModal
        isOpen={isAddQuestionModalOpen}
        onClose={handleCloseAddModal}
        onSubmit={handleAddQuestion}
        subjects={subjects}
        topics={topics}
        classes={classes}
        title={editingQuestion ? "Edit Question" : "Add Question"}
        editQuestion={editingQuestion}
      />

      {/* Upload Questions Modal */}
      <UploadQuestionsModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUploadQuestions}
        subjects={subjects}
        topics={topics}
        classes={classes}
      />

      {/* Question Details Modal */}
      <QuestionDetailsModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        onEdit={handleEditQuestion}
        question={selectedQuestion}
        subjects={subjects}
        topics={topics}
        classes={classes}
      />
    </div>
  )
}
