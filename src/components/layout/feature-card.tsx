interface FeatureCardProps {
    title: string;
    description: string;
    className?: string;
  }
  
  export function FeatureCard({ title, description, className = "" }: FeatureCardProps) {
    return (
      <div className={`rounded-3xl bg-white/5 backdrop-blur-sm p-6 ${className}`}>
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-400 text-sm">{description}</p>
      </div>
    )
  }
  
  