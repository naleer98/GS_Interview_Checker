import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
      message: '',
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      message:
        error?.message ||
        'Unexpected page error',
    };
  }

  componentDidCatch(error, info) {
    console.error(
      'GS Ready page error:',
      error,
      info
    );
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.resetKey !==
        this.props.resetKey &&
      this.state.hasError
    ) {
      this.setState({
        hasError: false,
        message: '',
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="page">
          <div className="card route-error">
            <h2>
              Page could not load
            </h2>

            <p>
              {this.state.message}
            </p>

            <button
              className="btn primary"
              type="button"
              onClick={() =>
                window.location.reload()
              }
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}