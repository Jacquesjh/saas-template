"use client";

import {useIntersectionObserver} from "usehooks-ts";
import {useEffect, useState} from "react";
import {logEvent} from "firebase/analytics";
import {clientAnalytics} from "@/lib/firebase/client-app";

interface Props {
  eventName: string;
  context?: {[key: string]: any};
}
export default function LogOnView(props: Props) {
  const [isLogged, setIsLogged] = useState(false);
  const {isIntersecting, ref} = useIntersectionObserver({
    threshold: 0.5,
  });

  useEffect(() => {
    if (isIntersecting && !isLogged) {
      console.log(`Logging event ${props.eventName} on view`);

      const func = async () => {
        const analytics = await clientAnalytics;
        if (analytics) {
          logEvent(analytics, props.eventName, props.context);
        }
      };

      func();
      setIsLogged(true);
    }
  }, [isIntersecting, isLogged, props]);

  return <div ref={ref}></div>;
}
