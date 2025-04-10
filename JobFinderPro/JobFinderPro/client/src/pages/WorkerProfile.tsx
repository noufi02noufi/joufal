import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import Header from "@/components/layout/Header";
import TabNavigation from "@/components/layout/TabNavigation";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { formatPrice } from "@/lib/utils";
import { User, WorkerProfile as WorkerProfileType, Review } from "@shared/schema";
import JobRequestModal from "@/components/modals/JobRequestModal";

export default function WorkerProfile() {
  const { id } = useParams();
  const workerId = parseInt(id);
  const [isJobRequestModalOpen, setIsJobRequestModalOpen] = useState(false);

  // Fetch worker details
  const { data: workerDetails, isLoading: isLoadingWorker } = useQuery({
    queryKey: [`/api/users/${workerId}`],
    queryFn: async () => {
      const res = await fetch(`/api/users/${workerId}`);
      if (!res.ok) throw new Error("Failed to fetch worker details");
      return res.json() as Promise<User & { workerProfile: WorkerProfileType }>;
    }
  });

  // Fetch worker reviews
  const { data: reviews, isLoading: isLoadingReviews } = useQuery({
    queryKey: [`/api/reviews/target/${workerId}`],
    queryFn: async () => {
      const res = await fetch(`/api/reviews/target/${workerId}`);
      if (!res.ok) throw new Error("Failed to fetch reviews");
      return res.json() as Promise<Review[]>;
    },
    enabled: !!workerId
  });

  // Mock job for job request modal
  const mockJob = {
    id: 1,
    title: "Fix Kitchen Sink",
    description: "Kitchen sink is leaking and needs urgent repair. Please bring basic tools.",
    category: "Plumbing",
    budget: 60000, // 600 rupees
    location: { latitude: 28.4595, longitude: 77.0266 },
    address: "Sector 15, Near City Park, Gurugram 122001",
    employerId: 1,
    workerId: null,
    status: "open",
    createdAt: new Date(),
    scheduledFor: new Date()
  };

  if (isLoadingWorker) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <TabNavigation />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center py-8">Loading worker profile...</div>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  if (!workerDetails) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <Header />
        <TabNavigation />
        <main className="container mx-auto px-4 py-6">
          <div className="text-center py-8">Worker not found</div>
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
        {/* Worker Profile Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="h-32 bg-primary-600 relative"></div>
          <div className="px-4 pb-4 relative">
            <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-white absolute -top-10">
              {workerDetails.profilePicture ? (
                <img 
                  src={workerDetails.profilePicture} 
                  alt={workerDetails.name} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-primary-500"
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
            
            <div className="pt-12">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-bold">{workerDetails.name}</h1>
                  <p className="text-primary-600 font-medium">{workerDetails.workerProfile.profession}</p>
                </div>
                <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-yellow-400 mr-1"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    stroke="none"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                  <span className="font-medium">{workerDetails.rating.toFixed(1)}</span>
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                <div className="flex gap-1 text-sm text-neutral-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-neutral-500"
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
                  <span>{workerDetails.address || "Location not specified"}</span>
                </div>
                
                <div className="flex gap-1 text-sm text-neutral-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-neutral-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>{workerDetails.phone}</span>
                </div>
                
                <div className="flex gap-1 text-sm text-neutral-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-neutral-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8" />
                    <path d="m3.3 7 8.7 5 8.7-5" />
                    <path d="M12 22V12" />
                  </svg>
                  <span>{workerDetails.email}</span>
                </div>
              </div>
              
              <div className="flex gap-4 mt-4">
                <button className="p-2 bg-green-50 text-green-600 rounded-full">
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
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </button>
                <button 
                  className="flex-1 py-2 bg-primary-500 text-white rounded-lg font-medium"
                  onClick={() => setIsJobRequestModalOpen(true)}
                >
                  Hire Now
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Worker Details */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Professional Details</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-neutral-50 p-3 rounded-lg">
              <p className="text-sm text-neutral-500 mb-1">Experience</p>
              <p className="font-medium">{workerDetails.workerProfile.experience} years</p>
            </div>
            <div className="bg-neutral-50 p-3 rounded-lg">
              <p className="text-sm text-neutral-500 mb-1">Availability</p>
              <p className="font-medium capitalize">{workerDetails.workerProfile.availability}</p>
            </div>
            <div className="bg-neutral-50 p-3 rounded-lg">
              <p className="text-sm text-neutral-500 mb-1">Hourly Rate</p>
              <p className="font-medium text-primary-600">₹{formatPrice(workerDetails.workerProfile.hourlyRate)}/hr</p>
            </div>
            <div className="bg-neutral-50 p-3 rounded-lg">
              <p className="text-sm text-neutral-500 mb-1">Daily Rate</p>
              <p className="font-medium text-primary-600">₹{formatPrice(workerDetails.workerProfile.dailyRate)}/day</p>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium mb-2">About</h3>
            <p className="text-sm text-neutral-600">{workerDetails.workerProfile.bio || "No bio provided."}</p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {workerDetails.workerProfile.skills && workerDetails.workerProfile.skills.length > 0 ? (
                workerDetails.workerProfile.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-neutral-500">No skills listed</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h2 className="text-lg font-semibold mb-3">Reviews & Ratings</h2>
          
          {isLoadingReviews ? (
            <div className="text-center py-4">Loading reviews...</div>
          ) : !reviews || reviews.length === 0 ? (
            <div className="text-center py-4 text-neutral-500">No reviews yet</div>
          ) : (
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-neutral-100 rounded-full flex-shrink-0 flex items-center justify-center mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-neutral-500"
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
                      <span className="font-medium">User #{review.userId}</span>
                    </div>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-neutral-200'}`}
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          stroke="none"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-neutral-600">{review.comment || "No comment provided."}</p>
                  <p className="text-xs text-neutral-400 mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <BottomNavigation />
      
      {/* Job Request Modal */}
      <JobRequestModal 
        isOpen={isJobRequestModalOpen}
        onClose={() => setIsJobRequestModalOpen(false)}
        job={mockJob}
        employerDetails={{
          name: "Priya Sharma",
          profilePicture: "https://randomuser.me/api/portraits/women/1.jpg",
          rating: 4.7
        }}
      />
    </div>
  );
}
