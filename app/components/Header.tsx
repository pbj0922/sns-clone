"use client";

import { NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

const Header: NextPage = () => {
  const { data: session } = useSession();

  useEffect(() => {
    console.log(session);
  }, [session]);

  // if (!session) {
  //   return (
  //     <div>
  //       <button onClick={() => signIn("github")}>Github Sign in</button>
  //       <button onClick={() => signIn("google")}>Google Sign in</button>
  //     </div>
  //   );
  // }

  if (!session) {
    return (
      <div className="bg-green-300">
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    );
  }

  return (
    <div className="bg-blue-300">
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};

export default Header;
