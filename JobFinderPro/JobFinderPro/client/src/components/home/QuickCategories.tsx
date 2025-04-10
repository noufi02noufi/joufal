import { Link } from "wouter";
import { professionCategories } from "@/lib/constants";

export default function QuickCategories() {
  // Only display first 3 categories + "More" option
  const displayCategories = professionCategories.slice(0, 3);

  return (
    <section className="mb-8">
      <h3 className="text-lg font-heading font-semibold mb-4">Quick Categories</h3>
      
      <div className="grid grid-cols-4 gap-3">
        {displayCategories.map((category, index) => (
          <Link key={category.id} href={`/find-workers?profession=${category.value}`}>
            <a className="flex flex-col items-center">
              <div className={`w-16 h-16 ${category.bgColor} rounded-full flex items-center justify-center mb-2`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-7 w-7 ${category.iconColor}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {category.icon}
                </svg>
              </div>
              <span className="text-sm text-center">{category.label}</span>
            </a>
          </Link>
        ))}
        
        <Link href="/find-workers">
          <a className="flex flex-col items-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-neutral-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <span className="text-sm text-center">More</span>
          </a>
        </Link>
      </div>
    </section>
  );
}
