import { Link, useLocation } from "wouter";

export default function TabNavigation() {
  const [location] = useLocation();
  
  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto">
        <div className="flex overflow-x-auto scrollbar-hide">
          <Link href="/">
            <a className={`px-4 py-3 font-medium ${location === "/" ? "text-primary-600 border-b-2 border-primary-500" : "text-neutral-500 hover:text-primary-600"} flex-shrink-0`}>
              Home
            </a>
          </Link>
          <Link href="/find-workers">
            <a className={`px-4 py-3 font-medium ${location === "/find-workers" ? "text-primary-600 border-b-2 border-primary-500" : "text-neutral-500 hover:text-primary-600"} flex-shrink-0`}>
              Find Workers
            </a>
          </Link>
          <Link href="/post-job">
            <a className={`px-4 py-3 font-medium ${location === "/post-job" ? "text-primary-600 border-b-2 border-primary-500" : "text-neutral-500 hover:text-primary-600"} flex-shrink-0`}>
              Post a Job
            </a>
          </Link>
          <Link href="/markets">
            <a className={`px-4 py-3 font-medium ${location === "/markets" ? "text-primary-600 border-b-2 border-primary-500" : "text-neutral-500 hover:text-primary-600"} flex-shrink-0`}>
              Markets
            </a>
          </Link>
          <Link href="/my-jobs">
            <a className={`px-4 py-3 font-medium ${location === "/my-jobs" ? "text-primary-600 border-b-2 border-primary-500" : "text-neutral-500 hover:text-primary-600"} flex-shrink-0`}>
              My Jobs
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
}
