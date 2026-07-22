import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
}

export default App;
