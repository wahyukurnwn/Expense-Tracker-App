export const dynamic = "force-dynamic"; // ⬅ fix utama

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="text-gray-600 mt-2">The page you're looking for doesn't exist.</p>
    </div>
  );
}
