import { Check } from "lucide-react"

const leftFeatures = [
  {
    icon: "💗",
    text: "Context-Aware Replies",
  },
  {
    icon: "⚡",
    text: "Instant Responses",
  },
  {
    icon: "🧹",
    text: "Clean, Distraction-Free Layout",
  },
  {
    icon: "📚",
    text: "Topic-Based Sessions",
  },
]

const rightFeatures = [
  {
    icon: "🛠️",
    text: "Custom Quiz Builder",
  },
  {
    icon: "🤖",
    text: "Auto-Generated Quizzes",
  },
  {
    icon: "📊",
    text: "Performance Insights",
  },
  {
    icon: "👥",
    text: "Export & Share Results",
  },
]

export function FeaturesSection() {
  return (
    <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Card - Instant Help */}
          <div className="bg-gradient-to-br from-[#309CEC] to-[#2589d4] rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">💬</span>
                <h3 className="text-2xl sm:text-3xl font-bold">Instant Help, Anytime</h3>
              </div>

              <p className="text-blue-100 text-base sm:text-lg mb-8 leading-relaxed">
                Your dashboard shows where you left off and what to focus on next—so you never miss a beat.
              </p>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                {leftFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center mr-3 flex-shrink-0">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg mr-2">{feature.icon}</span>
                    <span className="text-white font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Dashboard Mockup */}
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <div className="aspect-[4/3] bg-white/5 rounded-lg flex items-center justify-center relative">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">📱</span>
                    </div>
                    <p className="text-white/80 text-sm font-medium">Dashboard Interface</p>
                    <p className="text-white/60 text-xs mt-1">Interactive learning dashboard</p>
                  </div>

                  {/* Character placeholder */}
                  <div className="absolute bottom-2 right-2 w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center">
                    <span className="text-lg">👦</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card - Quiz Your Way */}
          <div className="bg-white rounded-3xl p-8 border-2 border-gray-100 shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">✅</span>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">Quiz Your Way!</h3>
              </div>

              <p className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed">
                Choose between custom or auto-generated quizzes to test your knowledge and track your growth.
              </p>

              {/* Features List */}
              <div className="space-y-4 mb-8">
                {rightFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-lg mr-2">{feature.icon}</span>
                    <span className="text-gray-700 font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Quiz Mockup */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <div className="aspect-[4/3] bg-white rounded-lg flex items-center justify-center relative border border-gray-100">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">📝</span>
                    </div>
                    <p className="text-gray-700 text-sm font-medium">Quiz Interface</p>
                    <p className="text-gray-500 text-xs mt-1">Interactive quiz builder</p>
                  </div>

                  {/* Character placeholder */}
                  <div className="absolute bottom-2 right-2 w-12 h-12 bg-orange-400 rounded-full flex items-center justify-center">
                    <span className="text-lg">👦</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-green-400 rounded-full opacity-60" />
            <div className="absolute bottom-8 left-4 w-3 h-3 bg-blue-400 rounded-full opacity-40" />
          </div>
        </div>
      </div>
    </section>
  )
}
