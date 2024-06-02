import React from 'react'
import { useSetRecoilState } from 'recoil';
import userAtom from '../atoms/userAtom';
import useShowToast from './useShowToast';

const useLogout = () => {
    const setUser = useSetRecoilState(userAtom);

  const showToast = useShowToast();

  const logout = async () => {
    try {
      const res = await fetch("/api/v1/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data?.error) {
        showToast("Error", data.error, "error", 3000, true);
      }

      localStorage.removeItem("user-upside");
      setUser({});

      // <Navigate to={RouteNames.login.path}/>;

    } catch (error) {
      console.log(error);

      showToast("Error", "Something went wrong", "error", 3000, true);
    }
  };
  return logout
}

export default useLogout