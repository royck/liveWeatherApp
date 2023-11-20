import React, { ReactNode } from 'react';
import { View, Text } from 'react-native';
import Screens from './src/screens/Index';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  // handle errors and update state
  static getDerivedStateFromError(_: Error): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error 
    console.error(error, errorInfo);
  }

  render() {
    // Render an error message
    if (this.state.hasError) {
      return (
        <View>
          <Text>Something went wrong. Please try again later.</Text>
        </View>
      );
    }

    // Render the children if no error occurred
    return this.props.children;
  }
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <Screens />
    </ErrorBoundary>
  );
};

export default App;
