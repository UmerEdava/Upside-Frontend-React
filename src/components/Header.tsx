import { Button, Flex, Image, Link, useColorMode } from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { Link as RouterLink } from "react-router-dom";
import userAtom from "../atoms/userAtom";
import { RouteNames } from "../routes";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import lightImg from "../assets/images/light-logo.svg";
import darkImg from "../assets/images/dark-logo.svg";
import useLogout from "../hooks/useLogout";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineSettings } from "react-icons/md";

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();

  const user = useRecoilValue(userAtom);

  const logout = useLogout();

  return (
    <Flex justifyContent={user && Object.keys(user).length > 0 ? "space-between" : "center"} mt={6} mb={12}>
      {user && Object.keys(user).length > 0 && (
        <Link as={RouterLink} to={RouteNames.home.path}>
          <AiFillHome size={24} />
        </Link>
      )}

      <Image
        cursor={"pointer"}
        alt="logo"
        w={6}
        src={colorMode === "dark" ? lightImg : darkImg}
        fallbackSrc={
          colorMode === "dark" ? lightImg : darkImg
        }
        onClick={toggleColorMode}
      />

      {user && Object.keys(user).length > 0 && (
        <Flex alignItems={'center'} gap={3}>
        <Link as={RouterLink} to={RouteNames.home.path + `${user.username}`}>
          <RxAvatar size={24} />
        </Link>

        <Link as={RouterLink} to={RouteNames.chat.path}>
          <BsFillChatQuoteFill size={20} />
        </Link>

        <Link as={RouterLink} to={RouteNames.settings.path}>
          <MdOutlineSettings size={20} />
        </Link>

        <Button size={'sm'} onClick={logout}>Logout</Button>
        </Flex>
      )}
    </Flex>
  );
}

export default Header;
