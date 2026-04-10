// Phase 1: hardcoded mock session. Phase 2 will use NextAuth/Clerk.
export const MOCK_SESSION = {
  user: {
    id: "mock-alice-id", // will be replaced by actual DB id after seed
    name: "Alice Chen",
    handle: "alice",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=alice",
    role: "maintainer",
    org: {
      id: "mock-org-id",
      name: "Hyprland",
      slug: "hyprland",
    },
  },
};
