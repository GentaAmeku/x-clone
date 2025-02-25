import { get } from "@/app/_lib/utils/fetcher";
import type { Post, PostWithUser, User } from "@/app/_types";
import { postsDb } from "@/app/api/_db";
import dayjs from "dayjs";
import type { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

const sortByTime = (posts: Post[]): Post[] => {
  return posts.sort((a, b) => {
    const [timeA, timeB] = [dayjs(a.time), dayjs(b.time)];
    return timeA.isAfter(timeB) ? -1 : 1;
  });
};

const generatePostData = (text: string, user: User): PostWithUser => {
  const now = dayjs();
  return {
    id: uuidv4(),
    text,
    reply: 0,
    repost: 0,
    hearts: 0,
    views: 0,
    time: now,
    fromNow: now.fromNow(),
    user_id: user.user_id,
    user,
  };
};

export type GetPostResponse = {
  data: PostWithUser[];
  nextCursor: string;
  hasNext: boolean;
};

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const cursor = searchParams.get("cursor");
  const limitParam = searchParams.get("limit");
  const limit = limitParam ? Math.min(Number(limitParam), 100) : undefined;

  const posts = postsDb.getAll();
  const sorted = sortByTime(posts);

  const i = sorted.findIndex((d) => d.id === cursor);
  const offset = i === -1 ? 0 : i + 1;

  const result =
    limit !== undefined ? sorted.slice(offset, offset + limit) : posts;

  const response: GetPostResponse = {
    data: result,
    nextCursor: result.at(-1)?.id || "",
    hasNext: result.length > 0,
  };

  return Response.json(response);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const data = Object.fromEntries(formData.entries());
  const me = await get<User>({
    url: "/api/users/me",
  });
  const postData = generatePostData(data.text as string, me);
  postsDb.insert(postData);
  return Response.json({ message: "success", data: postData });
}
