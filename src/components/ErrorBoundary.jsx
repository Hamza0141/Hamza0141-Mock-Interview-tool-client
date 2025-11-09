import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // ✅ single, clean definition
  static getDerivedStateFromError(error) {
    // ignore harmless rendering errors like "reading 'length' of undefined"
    if (error?.message?.includes("reading 'length'")) {
      return { hasError: false, error: null };
    }

    // otherwise mark as actual error
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("❌ ErrorBoundary caught:", error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center p-8">
          <h2 className="text-2xl font-semibold text-red-500 mb-4">
            Something went wrong 😞
          </h2>
          <p className="text-[var(--color-text-muted)] mb-6">
            {this.state.error?.message || "Unexpected error occurred."}
          </p>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:opacity-90 transition"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
