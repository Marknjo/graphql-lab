import { useQuery } from "@apollo/client";
import { useParams } from "react-router";
import { JOBS_QUERY, JOB_QUERY } from "./queries";

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
    fetchPolicy: "network-only",
    variables: { id: jobId },
  });

  return {
    job: data?.job,
    isLoading: loading,
    gqlErrors: Boolean(error),
  };
}
