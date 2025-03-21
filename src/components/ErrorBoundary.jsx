// src/components/ErrorBoundary.jsx
import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Erreur capturée :", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Une erreur s'est produite.</h2>
          <p>Détails : {this.state.error.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>Réessayer</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;