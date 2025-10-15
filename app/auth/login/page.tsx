"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  // Login state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Registro state
  const [registerNombre, setRegisterNombre] = useState("")
  const [registerApellido, setRegisterApellido] = useState("")
  const [registerEmail, setRegisterEmail] = useState("")
  const [registerRepeatEmail, setRegisterRepeatEmail] = useState("")
  const [registerDni, setRegisterDni] = useState("")
  const [registerTelefono, setRegisterTelefono] = useState("")
  const [registerDireccionBilletera, setRegisterDireccionBilletera] = useState("")
  const [registerPassword, setRegisterPassword] = useState("")
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      })

      if (error) throw error

      toast({
        title: "Inicio de sesión exitoso",
        description: "Bienvenido de vuelta",
      })

      router.push("/home")
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al iniciar sesión",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)

    // Validaciones
    if (registerEmail !== registerRepeatEmail) {
      toast({
        title: "Error",
        description: "Los correos electrónicos no coinciden",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (registerPassword !== registerConfirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/home`,
          data: {
            nombre: registerNombre,
            apellido: registerApellido,
            dni: registerDni,
            telefono: registerTelefono,
            direccion_billetera: registerDireccionBilletera,
          },
        },
      })

      if (error) throw error

      toast({
        title: "Cuenta creada exitosamente",
        description: "Por favor verifica tu correo electrónico",
      })

      router.push("/home")
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al crear cuenta",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Bienvenido</CardTitle>
          <CardDescription>Inicia sesión en tu cuenta</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
              <TabsTrigger value="register">Crear cuenta</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="bg-pink-50/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Contraseña</Label>
                  <Input
                    id="login-password"
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="bg-pink-50/50"
                  />
                </div>
                <button type="button" className="text-sm text-primary hover:underline">
                  ¿Olvidé mi contraseña?
                </button>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar sesión"
                  )}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  ¿No tienes cuenta?{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline font-medium"
                    onClick={() => {
                      const registerTab = document.querySelector('[value="register"]') as HTMLButtonElement
                      registerTab?.click()
                    }}
                  >
                    Regístrate
                  </button>
                </p>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-nombre">Nombre</Label>
                  <Input
                    id="register-nombre"
                    type="text"
                    required
                    value={registerNombre}
                    onChange={(e) => setRegisterNombre(e.target.value)}
                    className="bg-pink-50/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-apellido">Apellido</Label>
                  <Input
                    id="register-apellido"
                    type="text"
                    required
                    value={registerApellido}
                    onChange={(e) => setRegisterApellido(e.target.value)}
                    className="bg-pink-50/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    required
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    className="bg-pink-50/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-repeat-email">Repetir email</Label>
                  <Input
                    id="register-repeat-email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    required
                    value={registerRepeatEmail}
                    onChange={(e) => setRegisterRepeatEmail(e.target.value)}
                    className="bg-pink-50/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-dni">DNI</Label>
                  <Input
                    id="register-dni"
                    type="text"
                    required
                    value={registerDni}
                    onChange={(e) => setRegisterDni(e.target.value)}
                    className="bg-pink-50/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-telefono">Número de teléfono</Label>
                  <Input
                    id="register-telefono"
                    type="tel"
                    required
                    value={registerTelefono}
                    onChange={(e) => setRegisterTelefono(e.target.value)}
                    className="bg-pink-50/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-billetera">Dirección de billetera</Label>
                  <Input
                    id="register-billetera"
                    type="text"
                    required
                    value={registerDireccionBilletera}
                    onChange={(e) => setRegisterDireccionBilletera(e.target.value)}
                    className="bg-pink-50/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Contraseña</Label>
                  <Input
                    id="register-password"
                    type="password"
                    required
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="bg-pink-50/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">Confirmar contraseña</Label>
                  <Input
                    id="register-confirm-password"
                    type="password"
                    required
                    value={registerConfirmPassword}
                    onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                    className="bg-pink-50/50"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    "Crear cuenta"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
