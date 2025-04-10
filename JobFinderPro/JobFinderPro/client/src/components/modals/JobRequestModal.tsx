import { Job } from "@shared/schema";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface JobRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: Job;
  employerDetails?: {
    name: string;
    profilePicture: string;
    rating: number;
  };
}

export default function JobRequestModal({ isOpen, onClose, job, employerDetails }: JobRequestModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAccept = async () => {
    setIsLoading(true);
    try {
      await apiRequest("PATCH", `/api/jobs/${job.id}`, {
        status: "assigned",
        workerId: 2 // In a real app, this would be the current user's ID
      });
      
      toast({
        title: "Job Accepted",
        description: "You have successfully accepted this job request.",
      });
      
      onClose();
    } catch (error) {
      console.error("Error accepting job:", error);
      toast({
        title: "Error",
        description: "Failed to accept the job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-11/12 max-w-md max-h-[90vh] overflow-auto">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-heading font-semibold">New Job Request</h3>
            <button className="p-1" onClick={onClose}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-neutral-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full mr-3 bg-gray-200 overflow-hidden">
              {employerDetails?.profilePicture ? (
                <img 
                  src={employerDetails.profilePicture} 
                  alt={employerDetails.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary-500"
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
            <div>
              <h4 className="font-medium">{employerDetails?.name || "Employer"}</h4>
              <div className="flex items-center text-sm text-neutral-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-yellow-400 mr-1"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>{employerDetails?.rating || 0}</span>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h5 className="font-medium mb-1">{job.title}</h5>
            <p className="text-sm text-neutral-600 mb-2">{job.description}</p>
            
            <div className="bg-neutral-50 p-3 rounded-lg mb-3">
              <div className="flex flex-wrap gap-y-2 text-sm">
                <div className="w-1/2 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-neutral-500 mr-1"
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
                  <span>{job.location ? `${(job.location as any).distance || "2.1"} km away` : "Location unavailable"}</span>
                </div>
                <div className="w-1/2 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-neutral-500 mr-1"
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
                    {job.scheduledFor 
                      ? new Date(job.scheduledFor).toLocaleDateString() 
                      : "Today, ASAP"}
                  </span>
                </div>
                <div className="w-full flex items-center mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-neutral-500 mr-1"
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
                    Offered: <span className="font-medium text-primary-600">
                      ₹{job.budget ? (job.budget / 100).toFixed(0) : "Not specified"}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-neutral-50 p-3 rounded-lg">
              <h6 className="font-medium text-sm mb-2">Location</h6>
              <div className="h-32 bg-neutral-200 rounded mb-2">
                {/* Map would be displayed here */}
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-sm text-gray-500">Map loading...</p>
                </div>
              </div>
              <p className="text-sm text-neutral-600">{job.address}</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button 
              className="flex-1 py-3 border border-neutral-300 text-neutral-700 rounded-lg font-medium"
              onClick={handleDecline}
              disabled={isLoading}
            >
              Decline
            </button>
            <button 
              className="flex-1 py-3 bg-primary-500 text-white rounded-lg font-medium"
              onClick={handleAccept}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Accept"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
