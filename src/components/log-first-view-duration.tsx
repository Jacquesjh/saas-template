"use client";

import {useIntersectionObserver} from "usehooks-ts";
import {useEffect, useState} from "react";
import {logAnalyticsEvent} from "@/lib/analytics";

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
        try {
          await logAnalyticsEvent(props.eventName, {
            ...props.context,
            duration: duration,
          });
        } catch (error) {
          console.error(
            `Error logging event ${props.eventName}: Component was in view for ${duration} seconds`,
            error
          );
        }
      };

      func();

      if (process.env.NODE_ENV === "development") {
        console.log(
          `Logging event ${props.eventName}: Component was in view for ${duration} seconds`
        );
      }
      setIsLogged(true);
      setViewStartTime(null);
    }
  }, [isIntersecting, isLogged, viewStartTime, props]);

  return <div ref={ref} className="w-0 h-0"></div>;
}
