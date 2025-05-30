/**
 * Reusable loading spinner component
 * Provides consistent loading indicators throughout the application
 */
const LoadingSpinner = ({ size = "medium", className = "", text = "" }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  }

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-t-2 border-b-2 border-violet-600 ${sizeClasses[size]}`}></div>
      {text && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{text}</p>}
    </div>
  )
}

export default LoadingSpinner
