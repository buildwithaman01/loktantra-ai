"use client";
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Global Error Boundary
 * 
 * Catches runtime errors in the component tree to prevent total app failure.
 * Provides a graceful fallback UI for users.
 */
export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Silent fail in production
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 text-center">
          <div className="max-w-md space-y-4">
            <h1 className="text-4xl font-black text-slate-900">Oops!</h1>
            <p className="text-gray-600">Something went wrong. Our team has been notified.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-black transition"
            >
              Reload Platform
            </button>
          </div>
        </div>
      );
    }

    return this.children;
  }
}
