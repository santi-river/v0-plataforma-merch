import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function SuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg text-center">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-xl">La transacción se completó con éxito</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-purple-700 rounded-3xl transform rotate-6"></div>
              <div className="relative bg-white rounded-3xl p-6 shadow-lg">
                <div className="w-24 h-32 bg-gradient-to-br from-red-400 to-pink-400 rounded-lg flex items-center justify-center">
                  <div className="text-white text-4xl">📱</div>
                </div>
              </div>
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
