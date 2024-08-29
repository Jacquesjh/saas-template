import {logEvent} from "firebase/analytics";
import {clientAnalytics} from "./firebase/client-app";

export async function logAnalyticsEvent(
  eventName: string,
  eventParams?: object
) {
  try {
    const analytics = await clientAnalytics;
    if (analytics) {
      logEvent(analytics, eventName, eventParams);
    }
  } catch (error) {
    console.error("Error logging event", error);
  }
}
