"use client";

import {cn} from "@/lib/utils";
import {MenuIcon} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import {Dialog} from "./ui/dialog";
import {Button} from "./ui/button";
import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import ModeToggle from "./mode-toggle";
import Image from "next/image";
import Logo from "../../public/next.svg";
import config from "@/config";
import {useAuth} from "@/contexts/auth-context";
import ButtonSignin from "./button-signin";
import ButtonAccount from "./button-account";

const links: {
  href: string;
  label: string;
}[] = [
  {
    href: "/#pricing",
    label: "Pricing",
  },
  {
    href: "/#testimonials",
    label: "Reviews",
  },
  {
    href: "/#faq",
    label: "FAQ",
  },
];

export function NavBar() {
  const {user} = useAuth();

  const cta: JSX.Element = user ? <ButtonAccount /> : <ButtonSignin />;

  return (
    <div className="flex items-center min-w-full w-full fixed justify-center p-2 z-[50] mt-[2rem]">
      <div className="flex justify-between md:w-[720px] lg:w-[1024px] w-[95%] border dark:border-zinc-900 bg-opacity-10 relative backdrop-filter backdrop-blur-lg border-white border-opacity-20 rounded-xl p-2 shadow-lg">
        <div className="flex items-center gap-2 min-[825px]:hidden">
          <Link
            href="/"
            className="pl-2 flex items-center gap-2"
            title={`${config.appName} homepage`}>
            <Image
              src={Logo}
              alt={`${config.appName} logo`}
              priority={true}
              width={60}
              className="transition-all hover:opacity-75 dark:invert"
            />
          </Link>
          <Dialog>
            <SheetTrigger className=" p-2 transition">
              <MenuIcon />
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>{config.appName}</SheetTitle>

                <SheetDescription>{config.appDescription}</SheetDescription>
              </SheetHeader>
              <div className="flex flex-col space-y-3 mt-[1rem] z-[99]">
                {links.map((link) => {
                  return (
                    <Link key={link.label} href={link.href}>
                      <Button variant="outline" className="w-full">
                        {link.label}
                      </Button>
                    </Link>
                  );
                })}

                <ModeToggle />
              </div>
            </SheetContent>
          </Dialog>
        </div>
        <NavigationMenu>
          <NavigationMenuList className="max-[825px]:hidden ">
            <Link
              href="/"
              className="pl-2 flex items-center gap-2"
              title={`${config.appName} homepage`}>
              <Image
                src={Logo}
                alt={`${config.appName} logo`}
                priority={true}
                width={60}
                className="transition-all hover:opacity-75 dark:invert"
              />
              <span className="font-extrabold text-lg">{config.appName}</span>
            </Link>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center">
          <div className="flex items-center gap-2 max-[825px]:hidden">
            {links.map((link) => {
              return (
                <Link key={link.label} href={link.href}>
                  <Button variant="ghost">{link.label}</Button>
                </Link>
              );
            })}

            <ModeToggle />
          </div>
        </div>

        {cta}
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({className, title, children, ...props}, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}>
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
