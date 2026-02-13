interface SidebarHeaderProps {
  name: string;
  title: string;
}

export function SidebarHeader({ name, title }: SidebarHeaderProps) {
  return (
    <header className="bg-header-bg px-6 py-8">
      <h1 className="text-2xl font-extrabold uppercase tracking-wider text-header-text">
        {name}
      </h1>
      <p className="mt-1 text-sm font-medium uppercase tracking-wide text-header-text/80">
        {title}
      </p>
    </header>
  );
}
