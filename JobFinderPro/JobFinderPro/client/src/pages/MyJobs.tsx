import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import TabNavigation from "@/components/layout/TabNavigation";
import BottomNavigation from "@/components/layout/BottomNavigation";
import JobCard from "@/components/JobCard";
import { Link } from "wouter";
import { Job } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MyJobs() {
  const [activeTab, setActiveTab] = useState("employer");
  const mockUserId = 1; // In a real app, this would be the current user's ID

  const { data: employerJobs, isLoading: isLoadingEmployerJobs } = useQuery({
    queryKey: [`/api/jobs/employer/${mockUserId}`],
    queryFn: async () => {
      const res = await fetch(`/api/jobs/employer/${mockUserId}`);
      if (!res.ok) throw new Error("Failed to fetch employer jobs");
      return res.json() as Promise<Job[]>;
    }
  });

  const { data: workerJobs, isLoading: isLoadingWorkerJobs } = useQuery({
    queryKey: [`/api/jobs/worker/${mockUserId}`],
    queryFn: async () => {
      const res = await fetch(`/api/jobs/worker/${mockUserId}`);
      if (!res.ok) throw new Error("Failed to fetch worker jobs");
      return res.json() as Promise<Job[]>;
    },
    enabled: activeTab === "worker"
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <TabNavigation />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-heading font-bold mb-2">My Jobs</h1>
          <p className="text-neutral-600">Manage your job postings and assignments</p>
        </div>
        
        <Tabs defaultValue="employer" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="employer">Jobs Posted</TabsTrigger>
            <TabsTrigger value="worker">Jobs Assigned</TabsTrigger>
          </TabsList>
          
          <TabsContent value="employer" className="pt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Jobs You've Posted</h2>
              <Link href="/post-job">
                <a className="py-2 px-4 bg-primary-500 text-white rounded-lg text-sm font-medium">
                  Post a New Job
                </a>
              </Link>
            </div>
            
            {isLoadingEmployerJobs ? (
              <div className="text-center py-4">Loading jobs...</div>
            ) : !employerJobs || employerJobs.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg shadow-sm">
                <div className="bg-neutral-100 p-6 rounded-full inline-block mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-neutral-400"
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
                </div>
                <h3 className="text-lg font-medium mb-2">No jobs posted yet</h3>
                <p className="text-neutral-500 mb-4">
                  Create your first job posting to find skilled workers
                </p>
                <Link href="/post-job">
                  <a className="py-2 px-4 bg-primary-500 text-white rounded-lg text-sm font-medium">
                    Post a Job
                  </a>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {employerJobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="worker" className="pt-4">
            <h2 className="text-lg font-semibold mb-4">Jobs Assigned to You</h2>
            
            {isLoadingWorkerJobs ? (
              <div className="text-center py-4">Loading jobs...</div>
            ) : !workerJobs || workerJobs.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-lg shadow-sm">
                <div className="bg-neutral-100 p-6 rounded-full inline-block mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-neutral-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium mb-2">No jobs assigned yet</h3>
                <p className="text-neutral-500 mb-4">
                  Jobs that you accept will appear here
                </p>
                <Link href="/find-workers">
                  <a className="py-2 px-4 bg-primary-500 text-white rounded-lg text-sm font-medium">
                    Browse Jobs
                  </a>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {workerJobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
