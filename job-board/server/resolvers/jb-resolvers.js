import { Job } from "../db.js";

const resolvers = {
  Query: {
    jobs: async () => {
      return Job.findAll();
    },
  },
};

export { resolvers };
