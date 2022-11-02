import JobList from "./JobList";
import ErrorUI from "./ErrorUI";
import { useJobs } from "../graphql/gql-hooks";

function JobBoard() {
  const { jobs, loading, error } = useJobs();

  if (!jobs && loading) {
    return <p>Loading...</p>;
  }
  if (error) {
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
