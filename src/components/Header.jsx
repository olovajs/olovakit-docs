import { setState } from "olovakit";

export default function Header({ onMenuClick }) {
  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-[var(--vp-c-bg)] border-b border-[var(--vp-c-divider)]">
      <div className="mx-auto px-6 h-[var(--vp-nav-height)] flex items-center">
        <button
          className="lg:hidden p-2 mr-2 text-[var(--vp-c-text-1)] bg-transparent border-none cursor-pointer"
          onClick={onMenuClick}
        >
          <svg
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
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div className="flex-1 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center text-xl font-semibold text-[var(--vp-c-text-1)] no-underline"
          >
            <span className="ml-2">Olovakit</span>
          </a>
          <nav className="flex gap-6">
            <a
              href="/"
              className="text-[var(--vp-c-text-2)] no-underline text-sm font-medium transition-colors duration-250 hover:text-[var(--vp-c-brand)]"
            >
              Home
            </a>
            <a
              href="/introduction"
              className="text-[var(--vp-c-text-2)] no-underline text-sm font-medium transition-colors duration-250 hover:text-[var(--vp-c-brand)]"
            >
              Docs
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
