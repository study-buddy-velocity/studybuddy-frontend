import { ScrollArea } from "@/components/ui/scroll-area"
import { getNonRepeatingValues, subjectOptions, UserData } from "@/lib/utils";
import Image from "next/image"

  interface ProfileInfoProps {
    userData: UserData;
  }
export function Recommendations({userData} : ProfileInfoProps) {

  const recommendedSubjects = getNonRepeatingValues(userData.subjects, subjectOptions)
  return (
    <div className="p-6 rounded-[22.5px] border-2 border-[#737373] h-full" style={{ background: "#232323" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-[50%] overflow-hidden bg-[#8640FF]">
          <Image
            src="/assets/buddy/Joy-profile-icon.svg"
            alt="Recommendation mascot"
            width={48}
            height={48}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-lg font-medium">{userData.name}, This is what you should</h2>
          <p className="text-sm text-muted-foreground">focus on in my opinion...</p>
        </div>
      </div>
      
      <div className="mt-4  text-sm text-muted-foreground">Recommended Subjects</div>
      
      <ScrollArea 
        className="h-[300px] pr-4 mt-4" 
        style={{
          '--scrollbar-size': '4px',
          '--scrollbar-thumb-color': 'rgba(255, 255, 255, 0.1)',
        } as React.CSSProperties}
      >
        <div className="space-y-2">
        {
                recommendedSubjects.map((subject, index) => (
                  <input
                    key={index}
                    type="text"
                    value={subject}
                    className="w-full bg-[#3B3B3B] text-white placeholder:text-white/50 py-4 px-4 rounded-[10.79px]"
                    readOnly
                  />
                ))
              }
          {/* {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-lg transition-colors hover:bg-white/5"
              style={{ background: 'rgba(0, 0, 0, 0.2)' }}
            >
              <span className="text-sm">Photosynthesis</span>
              <Badge 
                variant="outline" 
                className="bg-transparent border-none text-muted-foreground"
              >
                #Biology
              </Badge>
            </div>
          ))} */}
        </div>
      </ScrollArea>
    </div>
  )
}

