import JobList from "./JobList";
import { useEffect, useState } from "react";
import { getJobs } from "../graphql/queries";
import ErrorUI from "./ErrorUI";

function JobBoard() {
  const [jobs, setGetJobs] = useState(null);
  const [gqlErrors, setGqlErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function gqlFetchJobs() {
      try {
        const jobs = await getJobs();
        setGetJobs(jobs);

        setIsLoading(false);
        setGqlErrors(false);
      } catch (error) {
        setGqlErrors(true);
        setIsLoading(false);
      }
    }
    gqlFetchJobs();
  }, []);

  if (!jobs && isLoading) {
    return <p>Loading...</p>;
  }
  if (gqlErrors) {
    return <ErrorUI />;
  }

  return (
    <div>
      <h1 className='title'>Job Board</h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default JobBoard;
