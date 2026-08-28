import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message: error?.message || 'Unexpected page error',
    };
  }

  componentDidCatch(error, info) {
    console.error('GS Ready page error:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="page">
        <div className="card route-error">
          <h2>Page could not load</h2>
          <p>{this.state.message}</p>
          <button className="btn primary" type="button" onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      </div>
    );
  }
}
