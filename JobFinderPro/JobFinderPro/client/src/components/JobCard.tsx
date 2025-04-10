import { Link } from "wouter";
import { Job } from "@shared/schema";
import { formatPrice, formatDate } from "@/lib/utils";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  // Determine the border color based on the job category
  const getBorderColorClass = (category: string) => {
    switch (category.toLowerCase()) {
      case "plumbing":
        return "border-primary-500";
      case "painting":
        return "border-secondary-500";
      case "electrical":
      case "electrician":
        return "border-blue-500";
      case "carpentry":
      case "carpenter":
        return "border-amber-500";
      default:
        return "border-gray-500";
    }
  };

  // Determine the badge color based on the job category
  const getBadgeClasses = (category: string) => {
    switch (category.toLowerCase()) {
      case "plumbing":
        return "bg-primary-50 text-primary-600";
      case "painting":
        return "bg-secondary-50 text-secondary-600";
      case "electrical":
      case "electrician":
        return "bg-blue-50 text-blue-600";
      case "carpentry":
      case "carpenter":
        return "bg-amber-50 text-amber-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 border-l-4 ${getBorderColorClass(job.category)}`}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold">{job.title}</h4>
        <div className={`${getBadgeClasses(job.category)} px-2 py-1 rounded text-xs font-medium`}>
          {job.category}
        </div>
      </div>
      <p className="text-sm text-neutral-600 mb-3">{job.description}</p>
      <div className="flex flex-wrap gap-y-2 text-sm text-neutral-500 mb-3">
        <div className="w-1/2 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{job.address}</span>
        </div>
        <div className="w-1/2 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>
            {job.scheduledFor ? formatDate(job.scheduledFor) : "No date specified"}
          </span>
        </div>
        <div className="w-1/2 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <span>
            ₹{job.budget ? formatPrice(job.budget) : "Not specified"}
          </span>
        </div>
        <div className="w-1/2 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
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
          <span>Posted by ID: {job.employerId}</span>
        </div>
      </div>
      <Link href={`/job/${job.id}`}>
        <a className="w-full py-2 border border-primary-500 text-primary-600 rounded-lg text-sm font-medium hover:bg-primary-50 transition block text-center">
          View Details
        </a>
      </Link>
    </div>
  );
}
