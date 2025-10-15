"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

function VerifyOrderContent() {
  const [isLoading, setIsLoading] = useState(false)
  const [codigo, setCodigo] = useState("")
  const [order, setOrder] = useState<{ codigo: string } | null>(null)
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return

      const supabase = createClient()
      const { data, error } = await supabase.from("orders").select("codigo").eq("id", orderId).single()

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo cargar la orden",
          variant: "destructive",
        })
        return
      }

      setOrder(data)
    }

    fetchOrder()
  }, [orderId, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)

    try {
      if (!orderId) {
        throw new Error("ID de orden no encontrado")
      }

      // Verificar el código
      if (codigo !== order?.codigo) {
        router.push("/order/error")
        return
      }

      // Actualizar el estado de la orden
      const { error } = await supabase.from("orders").update({ estado: "completado" }).eq("id", orderId)

      if (error) throw error

      router.push("/order/success")
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al verificar el código",
        variant: "destructive",
      })
      router.push("/order/error")
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
          <CardTitle className="text-xl">Código</CardTitle>
          <CardDescription>Ingresa el código recibido por el cliente</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                type="text"
                placeholder="Ingresa el código"
                required
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                className="bg-pink-50/50 text-center text-2xl font-bold tracking-wider"
                maxLength={4}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Ok"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      }
    >
      <VerifyOrderContent />
    </Suspense>
  )
}
