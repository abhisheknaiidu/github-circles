"use client";
import mixpanel from "mixpanel-browser";

const mixpanelProjectId = process.env.NEXT_PUBLIC_MIXPANEL_ID;
mixpanel.init(mixpanelProjectId as string, {
  debug: true,
  track_pageview: true,
  persistence: "localStorage",
});

export const trackEvent = (eventName: string, eventParams?: Object) => {
  let eventData = {};
  if (eventParams) {
    eventData = {
      ...eventParams,
    };
  }
  mixpanel.track(eventName, eventData);
};
