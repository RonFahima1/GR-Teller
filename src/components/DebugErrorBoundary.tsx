'use client';
import React from 'react';

export class DebugErrorBoundary extends React.Component<{children: React.ReactNode}, {error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { error };
  }
  componentDidCatch(error: any, info: any) {
    // You can log error to an error reporting service here
    console.error('ErrorBoundary caught:', error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ color: 'red', padding: 32 }}>
          <h1>App Error</h1>
          <pre>{this.state.error?.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
} 