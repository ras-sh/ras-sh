import { SiGithub } from "@icons-pack/react-simple-icons";
import Image from "next/image";
import Link from "next/link";
import icon from "@/app/icon.png";

export function TopBar() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-background/50 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 p-4">
        <Link
          className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
          href="/"
        >
          <Image
            alt="ras.sh"
            className="size-6"
            height={24}
            src={icon}
            width={24}
          />
        </Link>

        <Link
          className="inline-flex items-center transition-opacity hover:opacity-80"
          href="https://github.com/ras-sh/ras-sh"
          rel="noopener noreferrer"
          target="_blank"
        >
          <SiGithub className="size-5" />
        </Link>
      </div>
    </header>
  );
}
