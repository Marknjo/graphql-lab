import { Link } from "react-router-dom";
import { useJob } from "../graphql/gql-hooks";
import ErrorUI from "./ErrorUI";

function JobDetail() {
  const { job, isLoading, gqlErrors } = useJob();

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
