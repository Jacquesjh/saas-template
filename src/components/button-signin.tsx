"use client";

import {useAuth} from "@/contexts/auth-context";
import {signInWithGooglePopUp} from "@/lib/auth";
import {Button} from "./ui/button";

export default function ButtonSignin({
  text = "Get started",
}: {
  text?: string;
  extraStyle?: string;
}) {
  const {user} = useAuth();

  const handleClick = async () => {
    if (!user) {
      await signInWithGooglePopUp();
    }
  };

  return (
    !user && (
      <Button variant={"shadow"} onClick={handleClick}>
        {text}
      </Button>
    )
  );
}
