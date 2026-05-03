"use client";
import { Component, ReactNode } from "react";

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; message: string; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div
          role="alert"
          aria-live="assertive"
          className="p-6 bg-red-50 border border-red-200 rounded-xl text-center"
        >
          <p className="text-red-700 font-semibold">Something went wrong.</p>
          <p className="text-sm text-red-500 mt-1">{this.state.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, message: "" })}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm"
            aria-label="Retry the failed operation"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
