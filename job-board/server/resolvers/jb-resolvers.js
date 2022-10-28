import { Job, Company } from "../db.js";

const resolvers = {
  Query: {
    jobs: async () => {
      return Job.findAll();
    },
  },

  Job: {
    company: async (job) => {
      return Company.findById(job.companyId);
    },
  },
};

export { resolvers };
