/** Swap these colored blocks for layered PNGs (e.g. image_0793a2.jpg layers). */
export function AssetPlaceholder({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`asset-placeholder ${className}`} data-asset={label}>
      {children ?? label}
    </div>
  );
}
