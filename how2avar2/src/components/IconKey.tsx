import { StatusBadgeKey } from "@/components/StatusBadge";
import { PlatformIconKey } from "@/components/PlatformIcons";
import { statuses } from "@/utils/statuses";
import { osPlatforms, browserPlatforms } from "@/utils/platforms";

function IconKey({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <span>{label}</span>
      {children}
    </div>
  );
}

export function IconKeys() {
  return (
    <>
      <div className="sticky top-0 z-10 -mx-8 bg-fd-background px-8">
        <IconKey label="Statuses">
          {statuses.map((status) => (
            <StatusBadgeKey key={status} status={status} />
          ))}
        </IconKey>
      </div>
      <IconKey label="Operating Systems">
        {osPlatforms.map((platform) => (
          <PlatformIconKey key={platform} platform={platform} />
        ))}
      </IconKey>
      <IconKey label="Browsers">
        {browserPlatforms.map((platform) => (
          <PlatformIconKey key={platform} platform={platform} />
        ))}
      </IconKey>
    </>
  );
}
