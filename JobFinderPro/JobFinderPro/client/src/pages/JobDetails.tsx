import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import Header from "@/components/layout/Header";
import TabNavigation from "@/components/layout/TabNavigation";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Job, User } from "@shared/schema";

export default function JobDetails() {
  const { id } = useParams();
  const jobId = parseInt(id);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch job details
  const { data: job, isLoading: isLoadingJob } = useQuery({
    queryKey: [`/api/jobs/${jobId}`],
    queryFn: async () => {
      const res = await fetch(`/api/jobs/${jobId}`);
      if (!res.ok) throw new Error("Failed to fetch job details");
      return res.json() as Promise<Job>;
    }
  });

  // Fetch employer details
  const { data: employer, isLoading: isLoadingEmployer } = useQuery({
    queryKey: [`/api/users/${job?.employerId}`],
    queryFn: async () => {
      const res = await fetch(`/api/users/${job?.employerId}`);
      if (!res.ok) throw new Error("Failed to fetch employer details");
      return res.json() as Promise<User>;
    },
    enabled: !!job
  });

  // Apply for job handler
  const handleApplyForJob = async () => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would use the current user's ID
      const workerId = 2; 
      
      await apiRequest("PATCH", `/api/jobs/${jobId}`, {
        status: "assigned",
        workerId
      });
      
      // Invalidate job query to refresh the data
      queryClient.invalidateQueries({ queryKey: [`/api/jobs/${jobId}`] });
      
      toast({
        title: "Success",
        description: "You have successfully applied for this job",
      });
    } catch (error) {
      console.error("Failed to apply for job:", error);
      toast({
        title: "Error",
        description: "Failed to apply for job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "open":
        return <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">Open</span>;
      case "assigned":
        return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">Assigned</span>;
      case "completed":
        return <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">Completed</span>;
      case "cancelled":
        return <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">Cancelled</span>;
      default:
        return null;
    }
  };

  // Get border color based on category
  const getBorderColorClass = (category: string | undefined) => {
    if (!category) return "border-gray-500";
    
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

  if (isLoadingJob) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <TabNavigation />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center py-8">Loading job details...</div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <TabNavigation />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center py-8">Job not found</div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <TabNavigation />
      
      <main className="container mx-auto px-4 py-6">
        {/* Job Details Card */}
        <div className={`bg-white rounded-lg shadow-sm p-5 mb-6 border-l-4 ${getBorderColorClass(job.category)}`}>
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-xl font-bold">{job.title}</h1>
            {getStatusBadge(job.status)}
          </div>
          
          <div className="mb-6">
            <div className="inline-block bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
              {job.category}
            </div>
            <p className="text-neutral-600">{job.description}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-neutral-50 p-3 rounded-lg">
              <p className="text-sm text-neutral-500 mb-1">Budget</p>
              <p className="font-medium text-primary-600">₹{formatPrice(job.budget || 0)}</p>
            </div>
            <div className="bg-neutral-50 p-3 rounded-lg">
              <p className="text-sm text-neutral-500 mb-1">Posted On</p>
              <p className="font-medium">{formatDate(job.createdAt)}</p>
            </div>
            <div className="bg-neutral-50 p-3 rounded-lg">
              <p className="text-sm text-neutral-500 mb-1">Scheduled For</p>
              <p className="font-medium">{job.scheduledFor ? formatDate(job.scheduledFor) : "Not specified"}</p>
            </div>
            <div className="bg-neutral-50 p-3 rounded-lg">
              <p className="text-sm text-neutral-500 mb-1">Status</p>
              <p className="font-medium capitalize">{job.status}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="font-semibold mb-2">Location</h2>
            <div className="h-40 bg-neutral-200 rounded-lg mb-2">
              {/* Map would be displayed here */}
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-sm text-gray-500">Map loading...</p>
              </div>
            </div>
            <p className="text-neutral-600">{job.address}</p>
          </div>
          
          {/* Employer Info */}
          {isLoadingEmployer ? (
            <div className="text-center py-2">Loading employer details...</div>
          ) : employer ? (
            <div className="border-t pt-4">
              <h2 className="font-semibold mb-3">Posted By</h2>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-100 mr-3">
                  {employer.profilePicture ? (
                    <img 
                      src={employer.profilePicture} 
                      alt={employer.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-neutral-400"
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
                  <p className="font-medium">{employer.name}</p>
                  <div className="flex items-center text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-yellow-400 mr-1"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="none"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                    <span>{employer.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
          
          {job.status === "open" && (
            <Button 
              className="flex-1 bg-primary-500 hover:bg-primary-600"
              onClick={handleApplyForJob}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Apply for Job"}
            </Button>
          )}
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
