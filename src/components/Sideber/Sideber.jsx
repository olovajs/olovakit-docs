import { setState } from "olovakit";
import { Link } from "olovakit-router";

const sidebarLinks = {
  "getting-started": {
    title: "Getting Started",
    links: [
      { title: "Introduction", href: "/introduction" },
      { title: "Installation", href: "/installation" },
      { title: "Quick Start", href: "/quick-start" },
    ],
  },
  "core-concepts": {
    title: "Core Concepts",
    links: [
      { title: "State Management", href: "/state" },
      { title: "Effects", href: "/effects" },
      { title: "Routing", href: "/routing" },
    ],
  },
};

export default function Sideber({ isOpen }) {
  const [activeGroup, setActiveGroup] = setState(
    "getting-started,core-concepts"
  );

  const toggleGroup = (group) => {
    const groups = activeGroup.split(",");
    if (groups.includes(group)) {
      setActiveGroup(groups.filter((g) => g !== group).join(","));
    } else {
      setActiveGroup([...groups, group].join(","));
    }
  };

  return (
    <aside
      className={`fixed top-[var(--vp-nav-height)] bottom-0 left-0 z-40 w-[var(--vp-sidebar-width)] bg-[var(--vp-c-bg)] border-r border-[var(--vp-c-divider)] transition-transform duration-250 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0`}
    >
      <div className="h-full overflow-y-auto py-8">
        <nav className="px-3">
          {Object.entries(sidebarLinks).map(([key, group]) => (
            <div key={key} className="mb-6">
              <button
                className="flex items-center justify-between w-full px-3 py-2 text-[var(--vp-c-text-1)] font-semibold text-sm bg-transparent border-none cursor-pointer transition-colors duration-250 hover:text-[var(--vp-c-brand)]"
                onClick={() => toggleGroup(key)}
              >
                {group.title}
                <svg
                  className={`w-4 h-4 transition-transform duration-250 ${
                    activeGroup.includes(key) ? "rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-250 ${
                  activeGroup.includes(key) ? "max-h-[1000px]" : "max-h-0"
                }`}
              >
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="block px-3 py-2 text-[var(--vp-c-text-2)] text-sm leading-normal no-underline transition-colors duration-250 hover:text-[var(--vp-c-brand)]"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
