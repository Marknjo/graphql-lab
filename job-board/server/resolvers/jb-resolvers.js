import { Job, Company } from "../db.js";

const resolvers = {
  Query: {
    job: (_root, { id }) => Job.findById(id),
    jobs: () => Job.findAll(),
    company: (_root, { id }) => Company.findById(id),
  },

  Mutation: {
    createJob(_root, { input }) {
      return Job.create(input);
    },
    deleteJob(_root, { id }) {
      return Job.delete(id);
    },
    async updateJob(_root, { input }) {
      const oldData = await Job.findById(input.id);

      if (!oldData) {
        throw new Error(`Invalid Job Id: ${input.id}`);
      }

      return Job.update({
        ...oldData,
        ...input,
      });
    },
  },

  Company: {
    jobs: ({ id }) => Job.findAll((job) => job.companyId === id),
  },

  Job: {
    company: async (job) => {
      return Company.findById(job.companyId);
    },
  },
};

export { resolvers };
