import { LibraryCard } from "@/components/library-card";
import { LIBRARIES } from "@/lib/constants";

export function LibrariesSection() {
  return (
    <section className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {LIBRARIES.map((library, index) => (
          <LibraryCard key={index} library={library} />
        ))}
      </div>
    </section>
  );
}
