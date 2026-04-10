import { StatusBadgeKey } from "@/components/StatusBadge";
import { PlatformIconKey } from "@/components/PlatformIcons";
import { statuses } from "@/utils/statuses";
import { osPlatforms, browserPlatforms } from "@/utils/platforms";

function IconKey({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="not-prose mb-6 flex flex-wrap gap-3">
      <p>{label}</p>
      {children}
    </div>
  );
}

export function IconKeys() {
  return (
    <>
      <IconKey label="Statuses">
        {statuses.map((status) => (
          <StatusBadgeKey key={status} status={status} />
        ))}
      </IconKey>
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
