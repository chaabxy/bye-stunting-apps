"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AuthModel, type AuthState } from "@/model/auth-model"

export const useAdminLoginPresenter = () => {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    credentials: { email: "", password: "" },
    error: "",
    isLoading: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setState((prev) => ({
      ...prev,
      credentials: { ...prev.credentials, [name]: value },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setState((prev) => ({ ...prev, isLoading: true, error: "" }))

    // Simulate API call delay
    setTimeout(() => {
      if (AuthModel.validateCredentials(state.credentials)) {
        AuthModel.setAuthToken()
        router.push("/dashboard")
      } else {
        setState((prev) => ({
          ...prev,
          error: "Email atau password salah. Silakan coba lagi.",
          isLoading: false,
        }))
      }
    }, 1000)
  }

  return {
    credentials: state.credentials,
    error: state.error,
    isLoading: state.isLoading,
    handleInputChange,
    handleSubmit,
  }
}
