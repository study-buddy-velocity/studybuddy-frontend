import { Features } from "@/components/layout/features";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/layout/hero";
import { Navbar } from "@/components/layout/navbar";


export default function Home() {
  return (
    <main className=''>
      <Navbar/>
      <Hero/>
      <Features/>
      <Footer/>
    </main>
  )
}

