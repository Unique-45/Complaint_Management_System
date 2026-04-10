// Phase 1: hardcoded mock session. Phase 2 will use NextAuth/Clerk.
export const MOCK_SESSION = {
  user: {
    id: "mock-mayank-id", // will be replaced by actual DB id after seed
    name: "Mayank Goyal",
    handle: "mayank",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=mayank",
    role: "maintainer",
    org: {
      id: "mock-org-id",
      name: "Complaint Management",
      slug: "complaint-management",
    },
  },
};
