import config from "./config";

const customFetch = async (endpoint: string, options = {}) => {
  const url = `${config.apiBaseUrl}${endpoint}`;

  const response = await fetch(url, {
    credentials: "include",
    ...options,
  });

  if (!response.ok) {
    // Handle errors
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong");
  }

  return response;
};

export default customFetch;
