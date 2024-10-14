const config = {
  collectEndpoint: "/collect",
  debounceTime: 300, // ms
};

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const getPayload = (window) => {
  const {
    innerHeight: height,
    innerWidth: width,
    navigator: { language },
    location,
    document,
  } = window;
  const { title, referrer } = document;
  const { hostname, pathname } = location;
  return {
    height,
    width,
    language,
    title,
    referrer,
    hostname,
    pathname,
  };
};

const send = async (url, payload) => {
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-type": "application/json",
    },
  });
  if (res.ok) {
  }
};

((window) => {
  const { currentScript } = document;
  if (!currentScript) {
    console.error("Analytics script tag not found");
    return;
  }

  const baseUrl = new URL(currentScript.src).origin;
  const sendEvent = (payload) =>
    send(baseUrl + config.collectEndpoint, payload);

  sendEvent({ type: "identify", data: getPayload(window) });

  const handleRouteChange = debounce(
    () => sendEvent({ type: "pageview", data: getPayload(window) }),
    config.debounceTime,
  );

  window.addEventListener("popstate", handleRouteChange);

  const pushState = window.history.pushState;
  window.history.pushState = function (...args) {
    pushState.apply(window.history, args);
    handleRouteChange();
  };

  const replaceState = window.history.replaceState;
  window.history.replaceState = function (...args) {
    replaceState.apply(window.history, args);
    handleRouteChange();
  };

  ["pushState", "replaceState"].forEach((method) => {
    const original = window.history[method];
    window.history[method] = function (...args) {
      original.apply(window.history, args);
      handleRouteChange();
    };
  });

  document.addEventListener("click", (event) => {
    if (event.target.attributes.hasOwnProperty("worri-event-id")) {
      const eventName = event.target.attributes["worri-event-id"].value;
      debounce(
        () =>
          sendEvent({
            type: "event",
            name: eventName,
            data: getPayload(window),
          }),
        config.debounceTime,
      )();
    }
  });
})(window);
