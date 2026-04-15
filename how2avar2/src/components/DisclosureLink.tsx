import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

export function DisclosureLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="mr-2 text-fd-muted-foreground hover:text-fd-primary"
    >
      <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="size-3" />
    </a>
  );
}
