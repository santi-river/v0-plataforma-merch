import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Receipt } from "lucide-react"
import Link from "next/link"

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Obtener el perfil del usuario
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const saldo = profile?.saldo || 0

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">Bienvenido</h1>
          <p className="text-sm text-muted-foreground">Inicia sesión en tu cuenta</p>
        </div>

        <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white border-0 shadow-lg">
          <CardContent className="pt-6 pb-6">
            <p className="text-sm opacity-90 mb-2">Amount</p>
            <p className="text-4xl font-bold">${saldo.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Link href="/order/new" className="block">
          <Button className="w-full h-16 text-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-md">
            <Receipt className="mr-2 h-6 w-6" />
            Crear orden
          </Button>
        </Link>
      </div>
    </div>
  )
}
