import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './index';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.href = '/admin'; // Hard reset to a safe zone
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
                    <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-red-100 p-8 text-center animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-600 mx-auto mb-6">
                            <AlertTriangle size={40} />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Something went wrong</h1>
                        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                            A component crashed unexpectedly. We've logged the error and you can try to recover by refreshing or returning home.
                        </p>

                        <div className="space-y-3">
                            <Button
                                onClick={() => window.location.reload()}
                                className="w-full btn-premium btn-premium-primary h-12"
                            >
                                <RefreshCw size={18} className="mr-2" />
                                Refresh Page
                            </Button>
                            <Button
                                onClick={this.handleReset}
                                className="w-full bg-slate-100 text-slate-600 hover:bg-slate-200 h-12"
                            >
                                <Home size={18} className="mr-2" />
                                Return to Dashboard
                            </Button>
                        </div>

                        {process.env.NODE_ENV === 'development' && (
                            <div className="mt-8 p-4 bg-slate-900 rounded-xl text-left overflow-auto max-h-40">
                                <code className="text-[10px] text-red-400 font-mono">
                                    {this.state.error?.toString()}
                                </code>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
