import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { drizzle } from "drizzle-orm/d1";
import { invites } from "~/schema";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { DB } = context.cloudflare.env;
  const db = drizzle(DB);
  const id = crypto.randomUUID();
  await db.insert(invites).values({ id, code: "123" }).execute();
  const data = await db.select().from(invites).all();
  return json({ data });
};

//todo
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const { data } = useLoaderData<typeof loader>();
  return <h1>{JSON.stringify(data)}</h1>;
}
