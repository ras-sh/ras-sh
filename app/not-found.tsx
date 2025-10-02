import { Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-8 py-12">
      <div className="space-y-6 text-center">
        <h1 className="font-bold text-6xl text-zinc-100">404</h1>
        <h2 className="font-bold text-2xl text-zinc-300">Page Not Found</h2>
        <p className="max-w-md text-zinc-400">
          The page you're looking for doesn't exist. It might have been moved,
          deleted, or you entered the wrong URL.
        </p>
        <Link
          className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-6 py-3 font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
          href="/"
        >
          <Home size={18} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
