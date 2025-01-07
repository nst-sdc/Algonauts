const sendFetchRequest = async (
  url: string,
  type?: string,
  payload?: any
): Promise<any> => {
  const api_url = "http://localhost:3000/api";

  if (!url) {
    console.error("URL was not provided!");
    return { error: "URL must be passed" };
  }

  try {
    url = api_url + url;
    const response = await fetch(url, {
      method: type || "GET",
      headers: {
        "Content-Type": "application/json",
      },
      body: payload ? JSON.stringify(payload) : undefined,
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} - ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error during fetch request:", error);
    return { error: error.message, url };
  }
};

export default sendFetchRequest;
