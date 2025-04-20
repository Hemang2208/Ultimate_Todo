import ErrorBoundary from "../components/ErrorBoundary"

export default function DashboardLayout({ children }) {
  return <ErrorBoundary>{children}</ErrorBoundary>
}
