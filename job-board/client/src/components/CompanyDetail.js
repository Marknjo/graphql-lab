import { useCompany } from "../graphql/gql-hooks";
import ErrorUI from "./ErrorUI";
import JobList from "./JobList";

function CompanyDetail() {
  const { company, isLoading, gqlErrors } = useCompany();

  if (!company && isLoading) {
    return <p>Loading...</p>;
  }
  if (gqlErrors) {
    return <ErrorUI />;
  }

  return (
    <div>
      <h1 className='title'>{company.name}</h1>
      <div className='box'>{company.description}</div>
      <JobList jobs={company.jobs} />
    </div>
  );
}

export default CompanyDetail;
