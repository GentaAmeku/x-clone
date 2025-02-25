"use server";

import type { User } from "@/app/_types";
import { get } from "@/lib/utils/fetcher";
import RecommendedUsers from "./presentational";

const INITIAL_NUMBER_OF_USERS = 3;

export default async function RecommendedUsersContainer() {
  const users = await get<User[]>({
    url: "/api/users",
    queryParams: { limit: INITIAL_NUMBER_OF_USERS },
  });

  return <RecommendedUsers users={users} />;
}
