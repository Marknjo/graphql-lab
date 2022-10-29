import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getCompany } from "../graphql/queries";
import JobList from "./JobList";

function CompanyDetail() {
  const { companyId } = useParams();
  const [company, setGetCompany] = useState(null);

  useEffect(() => {
    async function gqlFetchCompany() {
      const company = await getCompany(companyId);
      setGetCompany(company);
    }
    gqlFetchCompany();
  }, [companyId]);

  if (!company) {
    return <p>Loading...</p>;
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
