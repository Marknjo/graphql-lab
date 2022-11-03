import { useMutation, useQuery } from "@apollo/client";
import { useParams } from "react-router";
import { getAccessToken } from "../auth";
import {
  COMPANY_QUERY,
  CREATE_JOB_MUTATION,
  JOBS_QUERY,
  JOB_QUERY,
} from "./queries";

export function useJobs() {
  const { data, loading, error } = useQuery(JOBS_QUERY, {
    fetchPolicy: "network-only",
  });

  return {
    jobs: data?.jobs,
    loading,
    error: Boolean(error),
  };
}

export function useJob() {
  const { jobId } = useParams();

  const { data, loading, error } = useQuery(JOB_QUERY, {
    variables: { id: jobId },
  });

  return {
    job: data?.job,
    isLoading: loading,
    gqlErrors: Boolean(error),
  };
}

export function useCompany() {
  const { companyId } = useParams();

  const { data, loading, error } = useQuery(COMPANY_QUERY, {
    variables: { id: companyId },
  });

  return {
    company: data?.company,
    isLoading: loading,
    gqlErrors: Boolean(error),
  };
}

export function useCreateJob() {
  const [mutate, { loading, error }] = useMutation(CREATE_JOB_MUTATION);

  async function createJob(input) {
    const variables = { input };
    const context = {
      headers: { Authorization: "Bearer " + getAccessToken() },
    };

    const { data: job } = await mutate({
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

  return {
    createJob,
    gqlErrors: Boolean(error),
    isLoading: loading,
  };
}
