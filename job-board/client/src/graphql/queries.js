import { request, gql } from "graphql-request";
const GRAPHQL_URL = "http://localhost:9000/api";

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

  const { jobs } = await request(GRAPHQL_URL, query);
  return jobs;
}
