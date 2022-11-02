import { Job, Company, User } from "../db.js";

const isLoggedIn = (userId) => {
  if (!userId) {
    throw new Error("Unauthorized to access");
  }
};

const checkId = async (id) => {
  const oldData = await Job.findById(id);

  if (!oldData) {
    throw new Error(`Invalid Job Id: ${id}`);
  }

  return oldData;
};

const getUserCompanyId = async (userId) =>
  (await User.findById(userId)).companyId;

const resolvers = {
  Query: {
    job(_root, { id }) {
      return Job.findById(id);
    },
    jobs() {
      return Job.findAll();
    },
    company(_root, { id }) {
      return Company.findById(id);
    },
  },

  Mutation: {
    async createJob(_root, { input }, { id: userId }) {
      /// find user company id
      const companyId = await getUserCompanyId(userId);

      // Check logging
      isLoggedIn(userId);

      // Action if logged in
      return Job.create({ ...input, companyId });
    },
    async deleteJob(_root, { id }, { id: userId }) {
      // Check logging
      isLoggedIn(userId);

      // Action
      await checkId(id);

      // Action if logged in
      return Job.delete(id);
    },
    async updateJob(_root, { input }, { id: userId }) {
      // Check logging
      isLoggedIn(userId);

      // Action if logged in
      /// Get old data
      const oldData = await checkId(input.id);

      /// Override and update
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
