import NavButton from "@/app/(organization)/minime/components/layout/nav-button";
import { database } from "@repo/backend/database";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { unsubscribe } from "./action";
import { eq } from "drizzle-orm";
import { subscribers } from "@repo/backend/schema";
import { getUserById } from "@repo/backend/auth/utils";

interface Props {
  searchParams: {
    subId: string;
  };
}

export const metadata: Metadata = {
  title: "Unsubscribe",
};

export default async function Unsubscribe({ searchParams }: Props) {
  const { subId } = await searchParams;
  if (!subId) {
    return notFound();
  }

 const subscriber = await database
  .select()
  .from(subscribers)
  .where(eq(subscribers.id, searchParams.subId))
  .limit(1)
  .then(rows => rows[0]);

  const user = await getUserById(subscriber.userId);


  if (!subscriber) {
    return notFound();
  }

  const data: { error?: string; success?: string } = await unsubscribe(
    searchParams.subId,
    subscriber.userId,
  );

  return (
    <div className="mx-auto px-2 w-[450px] max-[450px]:w-full min-h-screen flex items-center justify-center">
      <div className="w-full bg-gray-3 border border-gray-2 rounded-md p-5 flex flex-col items-center gap-3 justify-center">
        {data.success ? (
          <p className="text-gray-4 text-center">
            You&apos;ve successfully been unsubscribed from{" "}
            <b>
              {user?.user_metadata?.username}
              &apos;s newsletter.
            </b>
          </p>
        ) : (
          <b className="text-danger text-sm">{data.error}</b>
        )}

        <NavButton
          icon="arrowUpRight"
          buttonClassname="w-max px-2"
          href={`https://${user?.user_metadata?.domain || `${user?.user_metadata?.username}.` + process.env.NEXT_PUBLIC_USER_DOMAIN}`}
        >
          Resubscribe
        </NavButton>
      </div>
    </div>
  );
}
