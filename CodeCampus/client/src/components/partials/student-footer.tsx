import { Typography } from "@material-tailwind/react";
 
const LINKS = [
  {
    title: "Product",
    items: ["Overview", "Features", "Solutions", "Tutorials"],
  },
  {
    title: "Company",
    items: ["About us", "Careers", "Press", "News"],
  },
  {
    title: "Resource",
    items: ["Blog", "Newsletter", "Events", "Help center"],
  },
];
 
const currentYear = new Date().getFullYear();
 
export default function StudentFooter() {
  return (
    <footer className="relative w-full mt-20">
      <div className="mx-auto w-full max-w-7xl px-8">
        <div className="grid grid-cols-1 justify-between gap-4 md:grid-cols-2">
          <div className="flex flex-col">
            <Typography variant="h4" className="mb-1 font-extrabold">
              CodeCampus
            </Typography>
            <Typography variant="small" className="text-blue-gray-600">
              by Roushan Kumar
            </Typography>
          </div>
          <div className="grid grid-cols-3 justify-between gap-4">
            {LINKS.map(({ title, items }) => (
              <ul key={title}>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-3 font-medium opacity-40"
                >
                  {title}
                </Typography>
                {items.map((link) => (
                  <li key={link}>
                    <Typography
                      as="a"
                      href="#"
                      color="gray"
                      className="py-1.5 font-normal transition-colors hover:text-blue-gray-900"
                    >
                      {link}
                    </Typography>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <div className="mt-12 flex w-full flex-col items-center justify-between gap-3 border-t border-blue-gray-50 py-4 text-blue-gray-900 md:flex-row">
          <Typography variant="small" className="text-center">
            &copy; {currentYear} Roushan Kumar. All Rights Reserved.
          </Typography>
          <div className="flex gap-4 sm:justify-center">
            <a
              href="https://www.linkedin.com/in/roushan-kumar-7a4172257/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4.98 3.5C3.88 3.5 3 4.38 3 5.48c0 1.07.86 1.95 1.96 1.95h.02c1.12 0 1.99-.88 1.99-1.95C6.96 4.38 6.1 3.5 4.98 3.5zM4 8.25h2v12H4v-12zM9 8.25h1.92v1.26h.03c.27-.51.93-1.32 2.4-1.32 2.56 0 3.03 1.68 3.03 3.86v6.2h-2v-5.5c0-1.31-.47-2.21-1.65-2.21-.9 0-1.43.6-1.66 1.18-.09.22-.11.52-.11.83v5.7H9v-8.74z" />
              </svg>
            </a>
            <a
              href="https://github.com/roushanronny"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.29 3.44 9.77 8.21 11.36.6.11.82-.26.82-.58 0-.29-.01-1.04-.02-2.05-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.85 1.24 1.85 1.24 1.08 1.86 2.84 1.32 3.53 1.01.11-.79.42-1.32.77-1.63-2.66-.3-5.46-1.33-5.46-5.9 0-1.3.46-2.36 1.24-3.19-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.22a11.5 11.5 0 016 0c2.29-1.54 3.3-1.22 3.3-1.22.66 1.65.24 2.87.12 3.17.78.83 1.24 1.89 1.24 3.19 0 4.59-2.81 5.59-5.49 5.89.43.37.82 1.1.82 2.22v3.29c0 .33.22.7.83.58C20.56 22.27 24 17.79 24 12.5 24 5.87 18.63.5 12 .5z" />
              </svg>
            </a>
            <a
              href="mailto:roushankumarydv2003@gmail.com"
              aria-label="Email"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6c0-1.1.9-2 2-2zm0 2v.01L12 12l8-5.99V6H4zm0 2.236V18h16V8.236l-8 5.333-8-5.333z" />
              </svg>
            </a>
            <a
              href="tel:+919631985460"
              aria-label="Phone"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3.654 1.328A1 1 0 0 1 4.6 1h3.2a1 1 0 0 1 .95.684l1.2 3.6a1 1 0 0 1-.27 1.04L8.75 7.5a11.42 11.42 0 005.75 5.75l1.176-1.725a1 1 0 0 1 1.04-.27l3.6 1.2a1 1 0 0 1 .684.95v3.2a1 1 0 0 1-1 1c-9.39 0-17-7.61-17-17a1 1 0 0 1 1-1h3.2a1 1 0 0 1 .704.29l1.2 1.2a1 1 0 0 1-.27 1.54L7.2 6.4a9.06 9.06 0 006.4 6.4l1.016-.34a1 1 0 0 1 1.054.27l1.2 1.2a1 1 0 0 1 .29.704z" />
              </svg>
            </a>
            <a
              href="https://roushanronny.github.io/Portfolio-Website/"
              target="_blank"
              rel="noreferrer"
              aria-label="Portfolio website"
              className="opacity-80 transition-opacity hover:opacity-100"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6 9h-2.07a15.91 15.91 0 01-.8-4.01A8.004 8.004 0 0118 11zm-4.09 0H10.1c.2-2.01.86-3.63 1.9-4.78 1.03 1.15 1.69 2.77 1.9 4.78zM9.97 7.01A13.9 13.9 0 008.93 11H6.03a8.004 8.004 0 013.94-3.99zM6.03 13h2.9c.1 1.47.5 2.83 1.04 3.9A8.01 8.01 0 016.03 13zm4.07 0h2.81c-.2 1.9-.82 3.5-1.4 4.47-.58-.97-1.2-2.57-1.4-4.47zm4.0 0h2.9a8.01 8.01 0 01-3.94 3.9c.54-1.07.94-2.43 1.04-3.9z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}