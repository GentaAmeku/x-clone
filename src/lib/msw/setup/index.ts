async function initMocks() {
  if (process.env.NODE_ENV !== "development") return;

  if (typeof window === "undefined") {
    const { server } = await import("./server");
    server.listen();
  } else {
    const { worker } = await import("./browser");
    worker.start();
  }
}

export { initMocks };
