"use client";

import {useAuth} from "@/contexts/auth-context";
import {Avatar, AvatarFallback, AvatarImage} from "./ui/avatar";
import {Button} from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {signOut} from "@/lib/auth";
import {toast} from "sonner";
import {createPortalAction} from "@/actions/authenticated/stripe/create-portal-action";
import {useRouter} from "next/navigation";
import {User} from "@/models/user";

export default function ButtonAccount({user}: {user: User}) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.refresh();
  };

  const handleBilling = async () => {
    try {
      const result = await createPortalAction(window.location.href);

      if (!result.url) {
        toast.error("Error creating your checkout session.");
        return;
      }

      window.location.href = result.url;
    } catch (e) {
      console.error(e);
    }
  };

  return (
    user && (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.photoURL || ""} alt="user photo" />

              <AvatarFallback>
                {user.displayName?.charAt(0).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.displayName}
              </p>

              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={handleBilling}
              className="hover:cursor-pointer hover:bg-muted">
              Billing
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleSignOut}
            className="hover:cursor-pointer hover:bg-muted">
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
}
