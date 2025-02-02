import Image from 'next/image'
import { Button } from '@/components/ui/button'

export function Hero() {
  return (
    <div className="min-h-screen w-full relative flex items-center">

     <Image
        src="/assets/backgrounds/Main-BG-Final.png"
        alt=""
        fill
        className="object-cover"
        priority 
      /> 

<div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 z-10 space-y-6 text-center md:text-left mb-12 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Your Ultimate Study <br />
              Buddy to Crack <br />
              IIT & NEET!
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-lg mx-auto md:mx-0">
              Personalized tools to boost your preparation and get you closer to your dream institute.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Button size="lg" className="bg-gradient-to-r from-[#4024B9] to-[#8640FF] hover:opacity-90 rounded-[13px]">
                Meet my Buddy!
              </Button>
              <Button size="lg" variant="outline" className="bg-white text-[#4024B9] hover:bg-gray-100 rounded-[13px]">
                View Features
              </Button>
            </div>
          </div>

          <div className="w-full md:w-1/2 relative">
            <div className="aspect-square md:aspect-auto md:h-[600px] relative">
              <Image
                src="/assets/buddy/Joy-Main-hero.png"
                alt="Joy character"
                fill
                className="object-contain object-center"
                priority
              />
            </div>
          </div>
        </div>
      </div>

     </div>
  )
}

