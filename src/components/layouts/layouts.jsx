import { Routes, Route, useRouter } from "olovakit-router";
import MarkdownRenderer from "../pages/Introduction";
import Header from "../Header";
import Sideber from "../Sideber/Sideber";
import { setState } from "olovakit";

export default function Layouts() {
  const [isSidebarOpen, setIsSidebarOpen] = setState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="vitepress-container">
      <Header onMenuClick={toggleSidebar} />
      <div className="vitepress-wrapper">
        <Sideber isOpen={isSidebarOpen} />
        <main className="vitepress-content">
          <Routes>
            <Route path="/" element={<h1>Dashboard</h1>} />
            <Route path="/introduction" element={<MarkdownRenderer />} />
          </Routes>
        </main>
      </div>

      <style jsx global>{`
        .vitepress-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--vp-c-bg);
          color: var(--vp-c-text-1);
        }

        .vitepress-wrapper {
          flex: 1;
          display: flex;
          position: relative;
          margin: 0 auto;
          width: 100%;
        }

        .vitepress-content {
          flex-grow: 1;
          width: 100%;
          margin: 0 auto;
          max-width: 1440px;
        }

        @media (min-width: 960px) {
          .vitepress-content {
            padding: 32px 48px 96px;
          }
        }

        @media (min-width: 1440px) {
          .vitepress-content {
            padding: 32px 64px 96px;
          }
        }
      `}</style>
    </div>
  );
}
