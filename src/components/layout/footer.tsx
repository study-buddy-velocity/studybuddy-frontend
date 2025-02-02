import Link from 'next/link'

export function Footer() {
  return (
    <footer className="w-full py-8 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            studybuddy
          </Link>

          {/* Action Buttons */}
          {/* <div className="block gap-4">
            <Button asChild className="bg-[#6C47FF] hover:opacity-90 min-w-[120px]">
              <Link href="/signup">Sign Up</Link>
            </Button>
            <Button asChild variant="outline" className="bg-white text-[#4024B9] hover:bg-gray-100 min-w-[120px]">
              <Link href="/login">Log In</Link>
            </Button>
          </div> */}
        </div>

        {/* Copyright */}
        <div className="text-center mt-8 text-sm text-gray-400">
          All Copywrights reserved©2024
        </div>
      </div>
    </footer>
  )
}

