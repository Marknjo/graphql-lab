import { ApolloClient, gql, InMemoryCache } from "@apollo/client";
import { getAccessToken } from "../auth";
export const GRAPHQL_URL = "http://localhost:9000/api";

const client = new ApolloClient({
  uri: "http://localhost:9000/api",
  cache: new InMemoryCache(),
});

const JOB_QUERY = gql`
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

export async function getJob(id) {
  const variables = { id };

  const {
    data: { job },
  } = await client.query({ query: JOB_QUERY, variables });

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
  } = await client.query({ query, fetchPolicy: "network-only" });

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
  const mutation = gql`
    mutation createJobMutation($input: CreateJobInput!) {
      job: createJob(input: $input) {
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

  const variables = { input };
  const context = {
    headers: { Authorization: "Bearer " + getAccessToken() },
  };

  const {
    data: { job },
  } = await client.mutate({
    mutation,
    variables,
    context,
    update: (cache, { data: { job } }) => {
      cache.writeQuery({
        query: JOB_QUERY,
        variables: { id: job.id },
        data: { job },
      });
    },
  });

  return job;
}

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
