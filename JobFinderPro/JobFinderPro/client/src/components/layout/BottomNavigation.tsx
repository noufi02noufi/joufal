import { Link, useLocation } from "wouter";

export default function BottomNavigation() {
  const [location] = useLocation();
  
  return (
    <>
      <footer className="fixed bottom-0 w-full bg-white border-t shadow-md py-2 z-40">
        <div className="container mx-auto">
          <div className="flex justify-around items-center">
            <Link href="/">
              <a className={`flex flex-col items-center p-2 ${location === "/" ? "text-primary-600" : "text-neutral-400"}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <span className="text-xs mt-1">Home</span>
              </a>
            </Link>
            <Link href="/find-workers">
              <a className={`flex flex-col items-center p-2 ${location === "/find-workers" ? "text-primary-600" : "text-neutral-400"}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <span className="text-xs mt-1">Explore</span>
              </a>
            </Link>
            <div className="relative -top-5">
              <Link href="/post-job">
                <a className="w-14 h-14 bg-secondary-500 rounded-full flex items-center justify-center text-white shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                  </svg>
                </a>
              </Link>
            </div>
            <Link href="/my-jobs">
              <a className={`flex flex-col items-center p-2 ${location === "/my-jobs" ? "text-primary-600" : "text-neutral-400"}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                  <path d="M16 13H8" />
                  <path d="M16 17H8" />
                  <path d="M10 9H8" />
                </svg>
                <span className="text-xs mt-1">Jobs</span>
              </a>
            </Link>
            <Link href="/profile">
              <a className={`flex flex-col items-center p-2 ${location === "/profile" ? "text-primary-600" : "text-neutral-400"}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span className="text-xs mt-1">Profile</span>
              </a>
            </Link>
          </div>
        </div>
      </footer>
      <div className="h-20"></div>
    </>
  );
}
