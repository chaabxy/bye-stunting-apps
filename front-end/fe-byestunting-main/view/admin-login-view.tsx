"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useAdminLoginPresenter } from "@/presenter/admin/admin-login-presenter";

export default function AdminLoginView() {
  const { credentials, error, isLoading, handleInputChange, handleSubmit } =
    useAdminLoginPresenter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-cyan-100 py-12 px-4">
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-2xl rounded-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-extrabold text-primary">
            Admin <span className="text-secondary">Login</span>
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Kelola konten edukasi di Dashboard Admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Masukan Email Anda"
                required
                value={credentials.email}
                onChange={handleInputChange}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Masukan Password Anda"
                required
                value={credentials.password}
                onChange={handleInputChange}
                className="rounded-xl"
              />
            </div>
            <Button
              className="w-full bg-secondary hover:bg-blue-700 transition-colors duration-200 text-white font-semibold py-2 px-4 rounded-xl"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center items-center text-xs text-gray-400 mt-4 text-center">
          &copy; {new Date().getFullYear()} ByeStunting. Semua hak dilindungi.
        </CardFooter>
      </Card>
    </div>
  );
}
