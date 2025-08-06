import { getFirstWord, UserData } from "@/lib/utils";
import Image from "next/image";

interface ProfileInfoProps {
  userData: UserData;
}

export function Priorities({ userData }: ProfileInfoProps) {
  return (
    <div className="p-6 rounded-lg border-2 border-blue-200 bg-white h-full">
      <div className="flex flex-col sm:flex-row gap-6">
        <div className="flex flex-col items-center gap-4">
          <div className="w-[250px] h-[250px] relative rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src="/assets/buddy/Joy-Profile-Priorities.png"
              alt="Priority mascot"
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-2xl font-semibold mb-1 text-gray-800">
              {`${getFirstWord(userData.name)}'s priorities`}
            </h2>
            {/* <p className="text-xl text-muted-foreground">Let's Update'em!</p> */}
          </div>
          <div className="space-y-3">
            {userData.subjects.map((subject, index) => (
              <input
                key={index}
                type="text"
                value={subject}
                className="w-full bg-blue-50 border border-blue-200 text-gray-800 placeholder:text-gray-500 py-4 px-4 rounded-[10.79px]"
                readOnly
              />
            ))}
            {/* <Select>
              <SelectTrigger className="w-full bg-black/20 border-0 h-12 text-base">
                <SelectValue placeholder="Favourite Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="math">Mathematics</SelectItem>
                <SelectItem value="science">Science</SelectItem>
                <SelectItem value="english">English</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full bg-black/20 border-0 h-12 text-base">
                <SelectValue placeholder="Learning Goals" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="improve">Improve Grades</SelectItem>
                <SelectItem value="master">Master Concepts</SelectItem>
                <SelectItem value="prepare">Prepare for Exams</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="w-full bg-black/20 border-0 h-12 text-base">
                <SelectValue placeholder="Preferred Study Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visual">Visual Learning</SelectItem>
                <SelectItem value="practical">Practical Learning</SelectItem>
                <SelectItem value="theoretical">Theoretical Learning</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
        </div>
      </div>
    </div>
  );
}