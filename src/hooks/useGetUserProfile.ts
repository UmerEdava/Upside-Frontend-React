import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";

const useGetUserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { username } = useParams();

  const showToast = useShowToast();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data
        const res = await fetch(`/api/v1/user/${username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (data?.error) {
          showToast("Error", data.message, "error", 3000, false);
        }
        setUser(data?.data);
      } catch (error) {
        showToast("Error", "Something went wrong", "error", 3000, false);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [username, showToast]);

  return { loading, user };
};

export default useGetUserProfile;
