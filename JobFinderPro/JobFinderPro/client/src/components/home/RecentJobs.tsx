import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import JobCard from "@/components/JobCard";
import { Job } from "@shared/schema";

export default function RecentJobs() {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ["/api/jobs/nearby"],
    queryFn: async () => {
      // For demo purposes, we'll use the API directly without location filtering
      const res = await fetch("/api/jobs/nearby", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: 28.4595,
          longitude: 77.0266,
          radius: 50 // Larger radius to ensure we get results
        })
      });
      
      if (!res.ok) {
        throw new Error("Failed to fetch jobs");
      }
      
      return res.json() as Promise<Job[]>;
    }
  });

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-heading font-semibold">Recent Job Postings</h3>
        <Link href="/my-jobs">
          <a className="text-primary-600 text-sm font-medium">See All</a>
        </Link>
      </div>
      
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4">Loading jobs...</div>
        ) : !jobs || jobs.length === 0 ? (
          <div className="text-center py-4">No recent jobs found.</div>
        ) : (
          jobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))
        )}
      </div>
    </section>
  );
}
