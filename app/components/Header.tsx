"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { FC } from "react";

const Header: FC = () => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div>
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    );
  }

  return (
    <div className="bg-red-100">
      <Link href="/post/create">글생성</Link>
      <button onClick={() => signOut()}>Sign out</button>
    </div>
  );
};

export default Header;
