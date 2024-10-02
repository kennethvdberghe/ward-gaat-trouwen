import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
} from "@remix-run/cloudflare";
import { useFetcher, useLoaderData, useSubmit } from "@remix-run/react";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { useState } from "react";
import { invites } from "~/schema";
import * as schema from "../schema";

type Guest = typeof schema.guest.$inferSelect;
type QuestionFields =
  | "isAttending"
  | "attendingCeremony"
  | "attendingReception"
  | "attendingDinner"
  | "attendingParty";

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  const { code } = params;
  if (!code) {
    throw new Error("No code provided");
  }
  const { DB } = context.cloudflare.env;
  const db = drizzle(DB, { schema });
  const invite = await db.query.invites.findFirst({
    where: eq(invites.code, code),
    with: {
      guests: true,
    },
  });
  if (!invite) {
    throw new Error("No invite found");
  }

  return json(invite);
};

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const formData = await request.json();
  console.log(formData);
  return json({ success: true });
};

const isComplete = (guest: Guest) => {
  return (
    guest.isAttending === false ||
    (guest.attendingCeremony != null &&
      guest.attendingReception != null &&
      guest.attendingDinner != null &&
      guest.attendingParty != null)
  );
};

const firstIncomplete = (guests: Guest[]) => {
  return guests.findIndex((c) => !isComplete(c));
};

export default function Invite() {
  const { guests } = useLoaderData<typeof loader>();
  const submit = useSubmit();
  const [guestsInfo, setGuestsInfo] = useState(guests);

  const onChange =
    (index: number) => (field: QuestionFields, value: boolean | null) => {
      setGuestsInfo((prev) => {
        const newGuests = [...prev];
        newGuests[index][field] = value;
        return newGuests;
      });
    };

  return (
    <div>
      <h1>Hallo {guestsInfo.map((guest) => guest.name).join(" & ")}</h1>
      {guestsInfo
        .filter((c) => isComplete(c))
        .map((guest, index) => (
          <Guest key={guest.id} guest={guest} onChange={onChange(index)} />
        ))}
      {firstIncomplete(guestsInfo) !== -1 ? (
        <Guest
          key={guestsInfo[firstIncomplete(guestsInfo)].id}
          guest={guestsInfo[firstIncomplete(guestsInfo)]}
          onChange={onChange(firstIncomplete(guestsInfo))}
        />
      ) : (
        <button onClick={() => submit(guestsInfo, { method: "post" })}>
          Submit
        </button>
      )}
    </div>
  );
}

const Guest = ({
  guest,
  onChange,
}: {
  guest: Guest;
  onChange: (field: QuestionFields, value: boolean | null) => void;
}) => {
  const handleAttendingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const attending = e.target.value === "yes";
    onChange("isAttending", attending);
    if (!attending) {
      onChange("attendingCeremony", false);
      onChange("attendingReception", false);
      onChange("attendingDinner", false);
      onChange("attendingParty", false);
    } else {
      onChange("attendingCeremony", null);
      onChange("attendingReception", null);
      onChange("attendingDinner", null);
      onChange("attendingParty", null);
    }
  };

  return (
    <div>
      <p>
        {guest.name} kan er{" "}
        <select
          value={
            guest.isAttending == null ? "" : guest.isAttending ? "yes" : "no"
          }
          onChange={handleAttendingChange}
          className="border-b border-gray-300 w-32"
        >
          <option value="" className="hidden"></option>
          <option value="yes">wel</option>
          <option value="no">niet</option>
        </select>{" "}
        bij zijn.
      </p>
      {guest.isAttending && (
        <p>
          {guest.name} komt{" "}
          <select
            value={
              guest.attendingCeremony == null
                ? ""
                : guest.attendingCeremony
                ? "yes"
                : "no"
            }
            onChange={(e) =>
              onChange("attendingCeremony", e.target.value === "yes")
            }
            className="border-b border-gray-300 w-32"
          >
            <option value="" className="hidden"></option>
            <option value="yes">wel</option>
            <option value="no">niet</option>
          </select>
          naar de ceremonie.
        </p>
      )}
      {guest.isAttending && guest.attendingCeremony !== null && (
        <p>
          {guest.name} komt{" "}
          <select
            value={
              guest.attendingReception == null
                ? ""
                : guest.attendingReception
                ? "yes"
                : "no"
            }
            onChange={(e) =>
              onChange("attendingReception", e.target.value === "yes")
            }
            className="border-b border-gray-300 w-32"
          >
            <option value="" className="hidden"></option>
            <option value="yes">wel</option>
            <option value="no">niet</option>
          </select>
          naar de receptie.
        </p>
      )}
      {guest.isAttending && guest.attendingReception !== null && (
        <p>
          {guest.name} komt{" "}
          <select
            value={
              guest.attendingDinner == null
                ? ""
                : guest.attendingDinner
                ? "yes"
                : "no"
            }
            onChange={(e) =>
              onChange("attendingDinner", e.target.value === "yes")
            }
            className="border-b border-gray-300 w-32"
          >
            <option value="" className="hidden"></option>
            <option value="yes">wel</option>
            <option value="no">niet</option>
          </select>
          naar de avondmaaltijd.
        </p>
      )}
      {guest.isAttending && guest.attendingDinner !== null && (
        <p>
          {guest.name} komt{" "}
          <select
            value={
              guest.attendingParty == null
                ? ""
                : guest.attendingParty
                ? "yes"
                : "no"
            }
            onChange={(e) =>
              onChange("attendingParty", e.target.value === "yes")
            }
            className="border-b border-gray-300 w-32"
          >
            <option value="" className="hidden"></option>
            <option value="yes">wel</option>
            <option value="no">niet</option>
          </select>
          naar de feestavond.
        </p>
      )}
    </div>
  );
};
