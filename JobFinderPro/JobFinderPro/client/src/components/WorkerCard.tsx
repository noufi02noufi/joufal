import { Link } from "wouter";
import { WorkerWithProfile } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

interface WorkerCardProps {
  worker: WorkerWithProfile;
}

export default function WorkerCard({ worker }: WorkerCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
            {worker.profilePicture ? (
              <img 
                src={worker.profilePicture} 
                alt={worker.name} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary-500"
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
              </div>
            )}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between">
            <h4 className="font-semibold">{worker.name}</h4>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-yellow-400 mr-1"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="none"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="text-sm ml-1">{worker.rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-sm text-neutral-600 mb-1">{worker.workerProfile.profession}</p>
          <div className="flex items-center text-sm text-neutral-500">
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
            <span>{worker.distance ? `${worker.distance.toFixed(1)} km away` : "Distance unavailable"}</span>
          </div>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-primary-600 font-medium">
              ₹{formatPrice(worker.workerProfile.hourlyRate)}/hr
            </span>
            <div className="flex gap-2">
              <button className="p-2 bg-green-50 text-green-600 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </button>
              <Link href={`/worker/${worker.id}`}>
                <a className="py-1.5 px-3 bg-primary-500 text-white rounded-lg text-sm">
                  Hire Now
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
