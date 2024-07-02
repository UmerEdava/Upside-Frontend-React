import config from "./config";

const removeCookie = () => {
  deleteCookie('user-upside');
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

const customFetch = async (endpoint: string, options = {}) => {

  const url = `${config.apiBaseUrl}${endpoint}`;

  const response = await fetch(url, {
    credentials: "include",
    ...options,
  });

  if (!response.ok) {
    // Handle errors
    const errorData = await response.json();

    if (response.status === 401) {
      localStorage.removeItem("user-upside");
      window.location.reload();
      removeCookie();
    }

    throw new Error(errorData.message || "Something went wrong");

  }

  return response;
};

export default customFetch;
