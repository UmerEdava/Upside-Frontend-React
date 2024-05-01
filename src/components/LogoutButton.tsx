import React from "react";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { Button } from "@chakra-ui/react";
import { Navigate } from "react-router-dom";
import { RouteNames } from "../routes";

const LogoutButton = () => {
  const setUser = useSetRecoilState(userAtom);

  const showToast = useShowToast();

  const handleLogout = async () => {
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

      <Navigate to={RouteNames.login.path}/>;

    } catch (error) {
      console.log(error);

      showToast("Error", "Something went wrong", "error", 3000, true);
    }
  };

  return (
    <Button position={'fixed'} top={'30px'} right={'30px'} size={'sm'} onClick={handleLogout}>Logout</Button>
  );
};

export default LogoutButton;
