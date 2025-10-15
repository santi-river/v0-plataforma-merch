import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle } from "lucide-react"
import Link from "next/link"

export default function ErrorPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg text-center">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-red-100 p-4">
              <XCircle className="h-16 w-16 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-xl">La transacción no pudo ser realizada</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="70" r="8" fill="#E5E7EB" />
                <circle cx="50" cy="70" r="6" fill="#9CA3AF" />
                <rect x="45" y="40" width="10" height="25" rx="2" fill="#6B7280" />
                <path d="M 30 50 Q 30 35 50 35 Q 70 35 70 50" stroke="#6B7280" strokeWidth="3" fill="none" />
                <circle cx="40" cy="45" r="3" fill="#4B5563" />
                <circle cx="60" cy="45" r="3" fill="#4B5563" />
              </svg>
            </div>
          </div>

          <Link href="/home" className="block">
            <Button className="w-full">Ok</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
