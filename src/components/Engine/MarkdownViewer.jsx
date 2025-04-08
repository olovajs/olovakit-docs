import { setEffect, setState } from "olovakit";
import { marked } from "marked";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { createElement } from "olovakit";

// Configure marked with GitHub-style formatting
marked.setOptions({
  highlight: (code, lang) => {
    try {
      return hljs.highlight(code, { language: lang || "plaintext" }).value;
    } catch (e) {
      return hljs.highlight(code, { language: "plaintext" }).value;
    }
  },
  gfm: true,
  breaks: true,
  headerIds: true,
  mangle: false,
  pedantic: false,
  smartLists: true,
  smartypants: true,
  xhtml: true,
});

export default function MarkdownViewer({ markdownUrl = "/hello.md" }) {
  const [markdownContent, setMarkdownContent] = setState("");
  const [parsedHtml, setParsedHtml] = setState(null);
  const [tableOfContents, setTableOfContents] = setState([]);
  const [activeHeading, setActiveHeading] = setState("");
  const [isLoading, setIsLoading] = setState(true);

  setEffect(() => {
    fetch(markdownUrl)
      .then((res) => res.text())
      .then((text) => {
        const html = marked(text);
        setMarkdownContent(html);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error loading markdown:", error);
        setIsLoading(false);
      });
  }, [markdownUrl]);

  setEffect(() => {
    if (!markdownContent) return;

    // Create a temporary container to parse the HTML
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = markdownContent;

    // Extract headings for table of contents
    const headings = [];
    tempContainer.querySelectorAll("h1").forEach((heading) => {
      const text = heading.textContent;
      const id = text.toLowerCase().replace(/[^\w]+/g, "-");

      // Add id to the heading for linking
      heading.id = id;

      headings.push({
        id,
        text,
      });
    });

    setTableOfContents(headings);

    // Process code blocks
    tempContainer.querySelectorAll("pre code").forEach((codeBlock) => {
      const language = codeBlock.className.replace("language-", "");
      if (language) {
        codeBlock.innerHTML = hljs.highlight(codeBlock.textContent, {
          language,
        }).value;
      }
    });

    // Process tables - wrap them in a div for better mobile handling
    tempContainer.querySelectorAll("table").forEach((table) => {
      const wrapper = document.createElement("div");
      wrapper.className = "table-wrapper";
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });

    // Fix lists - ensure proper rendering of ul and ol elements
    tempContainer.querySelectorAll("ul, ol").forEach((list) => {
      // Add proper classes to ensure list styling works
      if (list.tagName.toLowerCase() === "ul") {
        list.classList.add("markdown-list", "markdown-list-ul");
      } else if (list.tagName.toLowerCase() === "ol") {
        list.classList.add("markdown-list", "markdown-list-ol");
      }

      // Ensure list items have proper styling
      list.querySelectorAll("li").forEach((item) => {
        item.classList.add("markdown-list-item");
      });
    });

    // Create a representation of the DOM structure
    const parseNode = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const props = {};

        // Copy attributes
        Array.from(node.attributes).forEach((attr) => {
          props[attr.name] = attr.value;
        });

        // Add event listeners for copy buttons if it's a pre element
        if (node.tagName.toLowerCase() === "pre") {
          props.className = (props.className || "") + " relative";

          // We'll add the copy button as a child element
          const children = Array.from(node.childNodes)
            .map(parseNode)
            .filter(Boolean);

          // Add copy button with clipboard icon
          const copyButton = createElement(
            "button",
            {
              className: "copy-code-button",
              onClick: (e) => {
                const codeElement =
                  e.currentTarget.parentNode.querySelector("code");
                if (codeElement) {
                  navigator.clipboard.writeText(codeElement.textContent);

                  // Fix: Check if currentTarget exists before setting innerHTML
                  if (e.currentTarget) {
                    e.currentTarget.textContent = "Copied!";
                    setTimeout(() => {
                      if (e.currentTarget) {
                        // Create SVG element instead of setting innerHTML
                        e.currentTarget.textContent = "";
                        const svg = document.createElementNS(
                          "http://www.w3.org/2000/svg",
                          "svg"
                        );
                        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                        svg.setAttribute("width", "24");
                        svg.setAttribute("height", "24");
                        svg.setAttribute("viewBox", "0 0 24 24");
                        svg.setAttribute("fill", "none");
                        svg.setAttribute("stroke", "currentColor");
                        svg.setAttribute("stroke-width", "2");
                        svg.setAttribute("stroke-linecap", "round");
                        svg.setAttribute("stroke-linejoin", "round");
                        svg.setAttribute(
                          "class",
                          "lucide lucide-clipboard-icon lucide-clipboard"
                        );

                        const rect = document.createElementNS(
                          "http://www.w3.org/2000/svg",
                          "rect"
                        );
                        rect.setAttribute("width", "8");
                        rect.setAttribute("height", "4");
                        rect.setAttribute("x", "8");
                        rect.setAttribute("y", "2");
                        rect.setAttribute("rx", "1");
                        rect.setAttribute("ry", "1");

                        const path = document.createElementNS(
                          "http://www.w3.org/2000/svg",
                          "path"
                        );
                        path.setAttribute(
                          "d",
                          "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                        );

                        svg.appendChild(rect);
                        svg.appendChild(path);
                        e.currentTarget.appendChild(svg);
                      }
                    }, 2000);
                  }
                }
              },
            },
            createElement(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                width: "24",
                height: "24",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                "stroke-width": "2",
                "stroke-linecap": "round",
                "stroke-linejoin": "round",
                class: "lucide lucide-clipboard-icon lucide-clipboard",
              },
              [
                createElement("rect", {
                  width: "8",
                  height: "4",
                  x: "8",
                  y: "2",
                  rx: "1",
                  ry: "1",
                }),
                createElement("path", {
                  d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
                }),
              ]
            )
          );

          children.push(copyButton);
          return createElement(node.tagName.toLowerCase(), props, children);
        }

        // Process other elements normally
        const children = Array.from(node.childNodes)
          .map(parseNode)
          .filter(Boolean);
        return createElement(node.tagName.toLowerCase(), props, children);
      }

      return null;
    };

    // Parse the entire content
    const parsedContent = Array.from(tempContainer.childNodes)
      .map(parseNode)
      .filter(Boolean);
    setParsedHtml(parsedContent);

    // Apply syntax highlighting after rendering
    setEffect(() => {
      if (parsedHtml) {
        hljs.highlightAll();
      }
    }, [parsedHtml]);
  }, [markdownContent]);

  // Track active heading on scroll
  setEffect(() => {
    if (!tableOfContents.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -80% 0px" }
    );

    // Observe all headings
    tableOfContents.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => {
      tableOfContents.forEach((heading) => {
        const element = document.getElementById(heading.id);
        if (element) observer.unobserve(element);
      });
    };
  }, [tableOfContents]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold text-gray-200 mb-2">
            Loading documentation...
          </div>
          <div className="text-gray-400">
            Please wait while we prepare the content
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="flex flex-col lg:flex-row">
        {/* Main content area */}
        <div className="flex-1 max-w-full lg:max-w-[calc(100%-18rem)] xl:max-w-[calc(100%-20rem)]">
          <div className="markdown-body prose prose-invert bg-opacity-80 p-4 md:p-8 rounded-lg">
            {parsedHtml}
          </div>
        </div>

        {/* Table of Contents */}
        {tableOfContents.length > 0 && (
          <div className="w-full lg:w-64 xl:w-72">
            <div className="lg:fixed lg:top-[5rem] lg:bottom-4 lg:right-4 lg:w-64 xl:w-72 overflow-auto">
              <div className="p-4">
                <nav className="vitepress-toc">
                  <div className="text-sm font-medium text-gray-400 mb-4">
                    On this page
                  </div>
                  <ul className="toc-list">
                    {tableOfContents.map((heading) => (
                      <li
                        key={heading.id}
                        className={`toc-item ${
                          activeHeading === heading.id ? "active" : ""
                        }`}
                      >
                        <a
                          href={`#${heading.id}`}
                          className="toc-link"
                          onClick={(e) => {
                            e.preventDefault();
                            const element = document.getElementById(heading.id);
                            if (element) {
                              element.scrollIntoView({ behavior: "smooth" });
                            }
                          }}
                        >
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        /* VitePress-like TOC styles */
        .vitepress-toc {
          position: relative;
          padding: 1rem;
          border-radius: 8px;
        }

        .toc-list {
          position: relative;
          list-style: none;
          padding-left: 0;
          margin: 0;
        }

        .toc-item {
          margin: 0.4rem 0;
          position: relative;
        }

        .toc-item::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 1px;
          background-color: #303030;
        }

        .toc-link {
          display: block;
          font-size: 0.875rem;
          color: #989898;
          text-decoration: none;
          padding: 0.35rem 0.6rem;
          padding-left: 1rem;
          border-radius: 4px;
          line-height: 1.4;
          transition: color 0.2s, background-color 0.2s;
          position: relative;
        }

        .toc-item.active::before {
          background-color: #fff;
        }

        .toc-link:hover {
          color: #fff;
          background-color: rgba(255, 255, 255, 0.04);
        }

        .toc-item.active > .toc-link {
          color: #fff;
          background-color: rgba(255, 255, 255, 0.04);
        }

        /* Remove all level-based padding since we only have one level */
        .level-1,
        .level-2,
        .level-3,
        .level-4,
        .level-5,
        .level-6 {
          padding-left: 0;
        }

        /* Enhanced GitHub-like markdown styles */
        .markdown-body {
          color: #e6edf3;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica,
            Arial, sans-serif;
          font-size: 16px;
          line-height: 1.6;
          max-width: 100%;
          overflow-x: auto;
        }

        /* Enhanced Heading Styles */
        .markdown-body h1,
        .markdown-body h2,
        .markdown-body h3,
        .markdown-body h4,
        .markdown-body h5,
        .markdown-body h6 {
          margin-top: 1.5em;
          margin-bottom: 1em;
          font-weight: 600;
          line-height: 1.25;
          color: #e6edf3;
          position: relative;
          scroll-margin-top: 2rem;
        }

        .markdown-body h1 {
          padding-bottom: 0.3em;
          font-size: 2.5em;
          border-bottom: 2px solid #30363d;
          margin-top: 0;
        }

        .markdown-body h2 {
          padding-bottom: 0.3em;
          font-size: 1.8em;
          border-bottom: 1px solid #30363d;
        }

        .markdown-body h3 {
          font-size: 1.5em;
        }

        .markdown-body h4 {
          font-size: 1.25em;
        }

        .markdown-body h5 {
          font-size: 1.1em;
        }

        .markdown-body h6 {
          font-size: 1em;
          color: #8b949e;
        }

        /* Enhanced Paragraph Styles */
        .markdown-body p {
          margin: 1em 0;
          line-height: 1.7;
        }

        /* Enhanced Blockquote Styles */
        .markdown-body blockquote {
          padding: 1em 1.5em;
          color: #8b949e;
          border-left: 4px solid #30363d;
          margin: 1.5em 0;
          background-color: rgba(110, 118, 129, 0.1);
          border-radius: 0 4px 4px 0;
        }

        /* Enhanced List Styles */
        .markdown-body ul,
        .markdown-body ol {
          padding-left: 2em;
          margin: 1.5em 0;
        }

        .markdown-body ul {
          list-style-type: disc;
        }

        .markdown-body ol {
          list-style-type: decimal;
        }

        .markdown-body li {
          margin: 0.5em 0;
          line-height: 1.7;
        }

        .markdown-body ul ul,
        .markdown-body ul ol,
        .markdown-body ol ul,
        .markdown-body ol ol {
          margin: 0.5em 0;
        }

        /* Enhanced Code Styles */
        .markdown-body code {
          padding: 0.2em 0.4em;
          margin: 0;
          font-size: 85%;
          background-color: rgba(110, 118, 129, 0.4);
          border-radius: 6px;
          font-family: ui-monospace, SFMono-Regular, SF Mono, Menlo, Consolas,
            Liberation Mono, monospace;
        }

        .markdown-body pre {
          padding: 1.5em;
          overflow: auto;
          font-size: 85%;
          line-height: 1.45;
          background-color: #161b22;
          border-radius: 6px;
          margin: 1.5em 0;
          border: 1px solid #30363d;
        }

        .markdown-body pre code {
          padding: 0;
          margin: 0;
          background-color: transparent;
          border: 0;
          white-space: pre;
          font-size: 100%;
          display: inline;
          max-width: auto;
          overflow: visible;
          line-height: inherit;
        }

        /* Modern Table Styles */
        .markdown-body table {
          width: 100%;
          margin: 1.5em 0;
          border: 1px solid #30363d;
          border-radius: 6px;
          border-spacing: 0;
          font-size: 0.95em;
        }

        .markdown-body table thead {
          background: #1a1f24;
          border-bottom: 2px solid #30363d;
        }

        .markdown-body table th {
          text-align: left;
          padding: 12px 16px;
          font-weight: 600;
          color: #e6edf3;
          font-size: 0.95em;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .markdown-body table td {
          padding: 12px 16px;
          line-height: 1.4;
          border-top: 1px solid #30363d;
          color: #c9d1d9;
        }

        .markdown-body table tr {
          background: #0d1117;
          transition: background-color 0.15s ease;
        }

        .markdown-body table tbody tr:first-child td {
          border-top: none;
        }

        .markdown-body table tr:nth-child(2n) {
          background: #161b22;
        }

        .markdown-body table tr:hover {
          background: #1b2027;
        }

        /* Table wrapper for horizontal scrolling on mobile */
        .markdown-body .table-wrapper {
          overflow-x: auto;
          max-width: 100%;
          border-radius: 6px;
          margin: 1.5em 0;
        }

        @media (max-width: 768px) {
          .markdown-body table {
            margin: 0;
            border: none;
          }

          .markdown-body table th,
          .markdown-body table td {
            padding: 8px 12px;
          }

          .markdown-body table th {
            font-size: 0.9em;
          }
        }

        /* Enhanced Image Styles */
        .markdown-body img {
          max-width: 100%;
          box-sizing: content-box;
          background-color: #0d1117;
          border-radius: 6px;
          margin: 1.5em 0;
        }

        /* Enhanced Horizontal Rule */
        .markdown-body hr {
          height: 0.25em;
          padding: 0;
          margin: 2em 0;
          background-color: #30363d;
          border: 0;
          border-radius: 2px;
        }

        /* Enhanced Link Styles */
        .markdown-body a {
          color: #58a6ff;
          text-decoration: none;
          transition: color 0.2s;
        }

        .markdown-body a:hover {
          color: #79b8ff;
          text-decoration: underline;
        }

        /* Copy button styles */
        .copy-code-button {
          position: absolute;
          top: 8px;
          right: 8px;
          padding: 4px 8px;
          color: #8b949e;
          background-color: #30363d;
          border: 1px solid #484f58;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .copy-code-button:hover {
          background-color: #3c444d;
          color: #e6edf3;
        }

        /* Responsive styles */
        @media (max-width: 768px) {
          .markdown-body {
            padding: 0 16px 16px 16px;
          }

          .markdown-body h1 {
            font-size: 2em;
          }

          .markdown-body h2 {
            font-size: 1.5em;
          }

          .markdown-body h3 {
            font-size: 1.25em;
          }
        }
      `}</style>
    </div>
  );
}
