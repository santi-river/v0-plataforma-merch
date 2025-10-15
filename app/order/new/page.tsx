"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewOrderPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [moneda, setMoneda] = useState("")
  const [monto, setMonto] = useState("")
  const [telefono, setTelefono] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("Usuario no autenticado")
      }

      // Generar código aleatorio de 4 dígitos
      const codigo = Math.floor(1000 + Math.random() * 9000).toString()

      const { data, error } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          moneda,
          monto: Number.parseFloat(monto),
          telefono,
          descripcion,
          codigo,
          estado: "pendiente",
        })
        .select()
        .single()

      if (error) throw error

      // Redirigir a la pantalla de código
      router.push(`/order/verify?id=${data.id}`)
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al crear la orden",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/home">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <CardTitle className="text-xl">Ingresa los datos solicitados</CardTitle>
          <CardDescription>Vamos a proceder con el pago</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="moneda">Moneda</Label>
              <Input
                id="moneda"
                type="text"
                placeholder="USD, EUR, etc."
                required
                value={moneda}
                onChange={(e) => setMoneda(e.target.value)}
                className="bg-pink-50/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monto">Monto</Label>
              <Input
                id="monto"
                type="number"
                step="0.01"
                placeholder="0.00"
                required
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="bg-pink-50/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono">Número de teléfono</Label>
              <Input
                id="telefono"
                type="tel"
                placeholder="+1234567890"
                required
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="bg-pink-50/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                placeholder="Describe tu orden..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="bg-pink-50/50 min-h-24"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Procesando...
                </>
              ) : (
                "Siguiente"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
