import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { json, useActionData } from "@remix-run/react";
import { drizzle } from "drizzle-orm/d1";
import { guest, invites } from "~/schema";

export const action = async ({ context }: ActionFunctionArgs) => {
  const { DB } = context.cloudflare.env;
  const db = drizzle(DB);
  const inviteId = crypto.randomUUID();
  await db.insert(invites).values({
    id: inviteId,
    code: "xyz",
  });
  const guestId1 = crypto.randomUUID();
  const guestId2 = crypto.randomUUID();

  const guests = await db
    .insert(guest)
    .values([
      {
        id: guestId1,
        name: "John Doe",
        inviteId: inviteId,
      },
      {
        id: guestId2,
        name: "Jane Doe",
        inviteId: inviteId,
      },
    ])
    .returning();
  return json({ guests });
};

export default function Seed() {
  const actionData = useActionData<typeof action>();
  return (
    <div>
      {JSON.stringify(actionData?.guests)}
      <form method="post">
        <button type="submit">Seed</button>
      </form>
    </div>
  );
}
