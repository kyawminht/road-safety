import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = '0bed743399a7f34872c5f4a8553e1908';

mixpanel.init(MIXPANEL_TOKEN, {
  track_pageview: true,
  persistence: 'localStorage',
  ip: true,
});

export const trackEvent = (eventName, properties = {}) => {
  mixpanel.track(eventName, {
    ...properties,
    timestamp: new Date().toISOString(),
    url: window.location.href,
    screen_width: window.innerWidth,
    screen_height: window.innerHeight,
  });
};

export const identifyUser = (id) => {
  mixpanel.identify(id);
};

export const setUserProperties = (properties) => {
  mixpanel.people.set(properties);
};

export default mixpanel;
