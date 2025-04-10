import { Link } from "wouter";

export default function PostJobCTA() {
  return (
    <section className="mb-8">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-5 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-heading font-semibold mb-2">Need specific work done?</h3>
            <p className="text-primary-100">Post a job and get matched with the right worker.</p>
          </div>
          <Link href="/post-job">
            <a className="bg-white text-primary-600 py-2.5 px-5 rounded-lg font-medium shadow-lg hover:bg-primary-50 transition inline-block text-center">
              Post a Job
            </a>
          </Link>
        </div>
      </div>
    </section>
  );
}
