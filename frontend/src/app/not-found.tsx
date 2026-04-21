import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#2D3142]">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-[#F4F1DE] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-[#F4F1DE] mb-2">Page not found</h2>
        <p className="text-[rgba(244,241,222,0.45)] mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-[#E07A5F] text-[#2D3142] font-semibold px-6 py-3 rounded-[6px] hover:opacity-90 transition-opacity"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
