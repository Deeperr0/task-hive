import e from "cors";
import React from "react";
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex flex-col justify-center items-center h-full gap-8 text-black text-2xl">
          <div className="text-danger flex justify-center w-full">
            <svg
              width={"5em"}
              height={"5em"}
              fill="currentColor"
              viewBox="0 0 128 128"
              xmlns="http://www.w3.org/2000/svg"
              className="mb-4"
            >
              <path
                fill="currentColor"
                d="M64 32.2c-4.4 0-8 3.3-8 7.3v24.8c0 4.1 3.6 7.3 8 7.3s8-3.3 8-7.3V39.5c0-4.1-3.6-7.3-8-7.3zM64 .3C28.7.3 0 28.8 0 64s28.7 63.7 64 63.7 64-28.5 64-63.7S99.3.3 64 .3zm0 121C32.2 121.3 6.4 95.7 6.4 64 6.4 32.3 32.2 6.7 64 6.7s57.6 25.7 57.6 57.3c0 31.7-25.8 57.3-57.6 57.3zm0-40.1c-4.4 0-8 3.3-8 7.3s3.6 7.3 8 7.3 8-3.3 8-7.3-3.6-7.3-8-7.3z"
              />
            </svg>
          </div>
          <h1 className="!text-5xl text-center font-semibold">
            Oops! Something went wrong.
          </h1>
          <p className="text-xl w-1/3 text-center">
            Please try one of the following: Refresh the page, check your
            internet connection, try again in a few minutes.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-lg px-4 py-2 hover:bg-accent-600 bg-accent-500 text-accent-50 rounded-xl"
          >
            Refresh Page
          </button>
          <p className="text-lg">
            Need help?{" "}
            <a
              className="text-accent-500 font-semibold hover:text-accent-600"
              href="/contact"
            >
              Contact support
            </a>
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
