export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center h-full w-full p-8">
      <div className="w-12 h-12 border-4 border-gray-800 border-t-primary-500 rounded-full animate-spin"></div>
    </div>
  );
}
