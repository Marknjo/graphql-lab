import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { getAccessToken } from "../auth";
export const GRAPHQL_URL = "http://localhost:9000/api";

export const client = new ApolloClient({
  uri: "http://localhost:9000/api",
  cache: new InMemoryCache(),
});

const JOB_DETAILS_FRAGMENT = gql`
  fragment JobDetails on Job {
    id
    title
    description
    company {
      id
      name
    }
  }
`;

export const JOB_QUERY = gql`
  query JobQuery($id: ID!) {
    job(id: $id) {
      ...JobDetails
    }
  }
  ${JOB_DETAILS_FRAGMENT}
`;

export const JOBS_QUERY = gql`
  query {
    jobs {
      ...JobDetails
    }
  }
  ${JOB_DETAILS_FRAGMENT}
`;

export const COMPANY_QUERY = gql`
  query CompanyQuery($id: ID) {
    company(id: $id) {
      id
      name
      description
      jobs {
        id
        title
      }
    }
  }
`;

export const CREATE_JOB_MUTATION = gql`
  mutation createJobMutation($input: CreateJobInput!) {
    job: createJob(input: $input) {
      ...JobDetails
    }
  }
  ${JOB_DETAILS_FRAGMENT}
`;

export async function deleteJob(id) {
  const mutation = gql`
    mutation deleteJobMutation($id: ID!) {
      job: deleteJob(id: $id) {
        id
        name
      }
    }
  `;
  const variables = { id };

  const context = {
    headers: { Authorization: "Bearer " + getAccessToken() },
  };

  const {
    data: { job },
  } = await client.mutate({ mutation, variables, context });

  return job;
}
