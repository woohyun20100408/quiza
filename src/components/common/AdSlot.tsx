type AdPlacement = 'home' | 'explore' | 'detail' | 'result';

type AdSlotProps = {
  placement: AdPlacement;
  enabled?: boolean;
};

export default function AdSlot({
  placement,
  enabled = import.meta.env.VITE_ADS_ENABLED === 'true',
}: AdSlotProps) {
  if (!enabled) return null;

  return (
    <aside className={`ad-slot ad-slot--${placement}`} aria-label="광고 영역">
      <span className="ad-slot-label">광고</span>
      <span className="ad-slot-copy">광고가 설정되면 이 영역에 표시됩니다</span>
    </aside>
  );
}
