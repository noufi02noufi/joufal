import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import FindWorkers from "@/pages/FindWorkers";
import PostJob from "@/pages/PostJob";
import Markets from "@/pages/Markets";
import MyJobs from "@/pages/MyJobs";
import WorkerProfile from "@/pages/WorkerProfile";
import JobDetails from "@/pages/JobDetails";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/find-workers" component={FindWorkers} />
      <Route path="/post-job" component={PostJob} />
      <Route path="/markets" component={Markets} />
      <Route path="/my-jobs" component={MyJobs} />
      <Route path="/worker/:id" component={WorkerProfile} />
      <Route path="/job/:id" component={JobDetails} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
