"use client";

import {useIntersectionObserver} from "usehooks-ts";
import {useEffect, useState} from "react";
import {logAnalyticsEvent} from "@/lib/analytics";

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
      const func = async () => {
        try {
          await logAnalyticsEvent(props.eventName, props.context);
        } catch (error) {
          console.error(
            `Error logging event ${props.eventName} on view`,
            error
          );
        }
      };

      func();
      setIsLogged(true);
    }
  }, [isIntersecting, isLogged, props]);

  return <div ref={ref} className="w-0 h-0"></div>;
}
