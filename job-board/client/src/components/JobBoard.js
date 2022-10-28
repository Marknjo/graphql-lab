import JobList from "./JobList";
import { useEffect, useState } from "react";
import { getJobs } from "../graphql/queries";

function JobBoard() {
  const [jobs, setGetJobs] = useState(null);

  useEffect(() => {
    async function gqlFetchJobs() {
      const jobs = await getJobs();
      setGetJobs(jobs);
    }
    gqlFetchJobs();
  }, []);

  if (!jobs) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1 className='title'>Job Board</h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default JobBoard;
