import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getCompany } from "../graphql/queries";
import ErrorUI from "./ErrorUI";
import JobList from "./JobList";

function CompanyDetail() {
  const { companyId } = useParams();
  const [company, setGetCompany] = useState(null);
  const [gqlErrors, setGqlErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function gqlFetchCompany() {
      try {
        const company = await getCompany(companyId);
        setGetCompany(company);

        setIsLoading(false);
        setGqlErrors(false);
      } catch (error) {
        setGqlErrors(true);
        setIsLoading(false);
      }
    }
    gqlFetchCompany();
  }, [companyId]);

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
