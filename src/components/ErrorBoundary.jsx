import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("❌ Error Boundary caught:", error, info);
  }

  handleReset = () => {
    // reset error boundary without full reload
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
