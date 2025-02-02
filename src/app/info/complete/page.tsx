'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function Complete() {
  const router = useRouter()

  return (
    <div className="container mx-auto px-4 flex flex-col items-center justify-center flex-1 relative x-10">
      <div className='max-w-[600px] w-full'>
      <h1 className="text-4xl font-bold text-white mb-12 text-center">
        Hey you are all set!
      </h1>

      <div className="relative w-full h-[400px] mb-4 border-2 border-[#FFFFFF4F] rounded-[17.65px] overflow-hidden">
        <Image
          src="/assets/buddy/complete.png"
          alt="Joy character"
          fill
          className="object-contain object-center"
        />
      </div>

      <Button 
        className="mt-2 w-full bg-gradient-to-r from-[#4024B9] to-[#8640FF] hover:opacity-90 text-[26px] font-bold py-8 rounded-[17.65px]"
        onClick={() => router.push('/chat')}
      >
        Take me to my Chat
      </Button>
      </div>

    </div>
  )
}

