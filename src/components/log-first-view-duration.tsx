"use client";

import {useIntersectionObserver} from "usehooks-ts";
import {useEffect, useState} from "react";
import {logEvent} from "firebase/analytics";
import {clientAnalytics} from "@/lib/firebase/client-app";

interface Props {
  eventName: string;
  context?: {[key: string]: any};
}
export default function LogFirstViewDuration(props: Props) {
  const [isLogged, setIsLogged] = useState(false);
  const [viewStartTime, setViewStartTime] = useState<Date | null>(null);
  const {isIntersecting, ref} = useIntersectionObserver({
    threshold: 0.5,
  });

  useEffect(() => {
    if (isLogged) {
      return;
    }

    if (isIntersecting && !viewStartTime) {
      const currentTime = new Date();
      setViewStartTime(currentTime);
    }

    if (!isIntersecting && viewStartTime) {
      const currentTime = new Date();
      const duration = Math.floor(
        (currentTime.getTime() - viewStartTime.getTime()) / 1000
      );

      const func = async () => {
        const analytics = await clientAnalytics;
        if (analytics) {
          logEvent(analytics, props.eventName, {
            ...props.context,
            duration: duration,
          });
        }
      };

      func();
      console.log(
        `Logging event ${props.eventName}: Component was in view for ${duration} seconds`
      );
      setIsLogged(true);
      setViewStartTime(null);
    }
  }, [isIntersecting, isLogged, viewStartTime, props]);

  return <div ref={ref}></div>;
}
