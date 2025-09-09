/**
 * ErrorBoundary: A class component that catches and handles JavaScript errors in its child component tree.
 * @module ErrorBoundary
 */
import React, { Component } from "react";

/**
 * ErrorBoundary class component
 * @extends Component
 */
class ErrorBoundary extends Component {
  // State Initialization Section
  // ---------------------------
  // Initialize state to track error occurrence and error details
  state = { hasError: false, error: null };

  // Lifecycle Method Section
  // ----------------------
  /**
   * Static lifecycle method to update state when an error is caught
   * @param {Error} error - The error object caught by the boundary
   * @returns {Object} Updated state with error details
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Rendering Section
  // ----------------
  /**
   * Renders either an error message or the child components
   * @returns {JSX.Element} Error message if an error occurred, otherwise child components
   */
  render() {
    if (this.state.hasError) {
      // Display error message if an error was caught
      return (
        <div className="bg-white p-4 rounded shadow text-red-500">
          Something went wrong: {this.state.error.message}
        </div>
      );
    }
    // Render child components if no error occurred
    return this.props.children;
  }
}

export default ErrorBoundary;