import { LibraryCard } from "@/components/library-card";
import { LIBRARIES } from "@/lib/constants";

export function LibrariesSection() {
  return (
    <section className="space-y-6 sm:space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
        {LIBRARIES.map((library) => (
          <LibraryCard key={library.id} library={library} />
        ))}
      </div>
    </section>
  );
}
