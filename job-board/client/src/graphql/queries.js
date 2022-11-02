import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { request } from "graphql-request";
import { getAccessToken } from "../auth";
export const GRAPHQL_URL = "http://localhost:9000/api";

const client = new ApolloClient({
  uri: "http://localhost:9000/api",
  cache: new InMemoryCache(),
});

export async function getJob(id) {
  const query = gql`
    query JobQuery($id: ID!) {
      job(id: $id) {
        id
        title
        description
        company {
          id
          name
        }
      }
    }
  `;
  const variables = { id };

  const {
    data: { job },
  } = await client.query({ query, variables });

  return job;
}

export async function getJobs() {
  const query = gql`
    query {
      jobs {
        id
        title
        description
        company {
          id
          name
        }
      }
    }
  `;

  const {
    data: { jobs },
  } = await client.query({ query });

  return jobs;
}

export async function getCompany(id) {
  const query = gql`
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
  const variables = { id };

  const {
    data: { company },
  } = await client.query({ query, variables });

  return company;
}

/// Mutations
export async function createJob(input) {
  const query = gql`
    mutation createJobMutation($input: CreateJobInput!) {
      job: createJob(input: $input) {
        id
        title
        company {
          id
          name
        }
      }
    }
  `;

  const variables = { input };
  const headers = { Authorization: "Bearer " + getAccessToken() };

  const { job } = await request(GRAPHQL_URL, query, variables, headers);

  return job;
}

export async function deleteJob(id) {
  const query = gql`
    mutation deleteJobMutation($id: ID!) {
      job: deleteJob(id: $id) {
        id
        name
      }
    }
  `;
  const variables = { id };

  const { job } = await request(GRAPHQL_URL, query, variables);

  return job;
}
