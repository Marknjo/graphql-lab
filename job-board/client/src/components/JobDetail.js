import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { getJob } from "../graphql/queries";
import ErrorUI from "./ErrorUI";

function JobDetail() {
  const [job, setJob] = useState(null);
  const { jobId } = useParams();
  const [gqlErrors, setGqlErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchJob() {
      try {
        const job = await getJob(jobId);

        setJob(job);

        setIsLoading(false);
        setGqlErrors(false);
      } catch (error) {
        setGqlErrors(true);
        setIsLoading(false);
      }
    }

    fetchJob();
  }, [jobId]);

  if (!job && isLoading) {
    return <p>Loading...</p>;
  }
  if (gqlErrors) {
    return <ErrorUI />;
  }

  return (
    <div>
      <h1 className='title'>{job.title}</h1>
      <h2 className='subtitle'>
        <Link to={`/companies/${job.company.id}`}>{job.company.name}</Link>
      </h2>
      <div className='box'>{job.description}</div>
    </div>
  );
}

export default JobDetail;
