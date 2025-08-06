export function BackgroundElements() {
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top left gradient blob */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-orange-200/30 rounded-full blur-3xl" />
  
        {/* Top right gradient blob */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-bl from-blue-200/30 to-purple-200/30 rounded-full blur-3xl" />
  
        {/* Bottom left gradient blob */}
        <div className="absolute -bottom-40 -left-20 w-96 h-96 bg-gradient-to-tr from-yellow-200/30 to-orange-300/30 rounded-full blur-3xl" />
  
        {/* Bottom right gradient blob */}
        <div className="absolute -bottom-20 -right-40 w-80 h-80 bg-gradient-to-tl from-blue-300/30 to-cyan-200/30 rounded-full blur-3xl" />
  
        {/* Geometric shapes */}
        <div className="absolute top-20 right-1/4 w-4 h-4 bg-[#309CEC]/20 rotate-45" />
        <div className="absolute top-1/3 left-1/4 w-6 h-6 bg-orange-300/30 rounded-full" />
        <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-pink-300/40 rotate-45" />
      </div>
    )
  }
  