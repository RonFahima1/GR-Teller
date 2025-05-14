"use client"

import React from "react"
import { Button } from "./button"
import { useTranslation } from "@/hooks/useTranslation"

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
          <h2 className="text-2xl font-semibold mb-4">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <Button
            onClick={() => {
              this.setState({ hasError: false })
              window.location.reload()
            }}
          >
            Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
} 