import {
  Avatar,
  Box,
  Button,
  Flex,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Spinner,
  Text,
  useColorMode,
  WrapItem,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import userAtom from "../atoms/userAtom";
import { RouteNames } from "../routes";
import { AiFillHome } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import lightImg from "../assets/images/logo-light.png";
import darkImg from "../assets/images/logo-dark.png";
import useLogout from "../hooks/useLogout";
import { BsFillChatQuoteFill } from "react-icons/bs";
import { MdOutlineLogout, MdOutlineSettings, MdSearch } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { IoSearch } from "react-icons/io5";
import customFetch from "../api";
import useShowToast from "../hooks/useShowToast";

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();

  const user = useRecoilValue(userAtom);

  const logout = useLogout();

  const showToast = useShowToast();

  const navigate = useNavigate();

  const searchBoxRef = useRef<any>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  // const [loadingChat, setLoadingChats] = useState(false);
  const [searchResult, setSearchResult] = useState<any>([]);
  const [searchComplete, setSearchComplete] = useState(false);

  const handleSearchUsers = async (e: any) => {
    e.preventDefault();
    try {
      if (!searchKey) return;

      setSearchLoading(true);
      // setLoadingChats(true);

      // Fetch chats
      const res = await customFetch(`/api/v1/user/search/${searchKey}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data?.error) {
        return showToast("Error", data.message, "error", 3000, false);
      }

      // setSearchUsers(data?.data);
      setSearchResult(data?.data);
      setSearchComplete(true);
    } catch (error) {
      return showToast("Error", "Something went wrong", "error", 3000, false);
    } finally {
      setSearchLoading(false);
      // setLoadingChats(false);
    }
  };

  const handleCloseSearchBox = () => {
    setIsSearchOpen(false);
    setSearchKey("");
    setSearchComplete(false);
  };

  const handleClickOutside = (event: any) => {
    if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
      handleCloseSearchBox();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <Flex
        justifyContent={
          user && Object.keys(user).length > 0 ? "space-between" : "center"
        }
        mt={6}
        mb={12}
      >
        {user && Object.keys(user).length > 0 && (
          <Link as={RouterLink} to={RouteNames.home.path}>
            <AiFillHome size={24} />
          </Link>
        )}

        <Image
          cursor={"pointer"}
          alt="logo"
          w={"2rem"}
          h={"2rem"}
          src={colorMode === "dark" ? lightImg : darkImg}
          fallbackSrc={colorMode === "dark" ? lightImg : darkImg}
          onClick={toggleColorMode}
        />

        {user && Object.keys(user).length > 0 && (
          <Flex alignItems={"center"} gap={3}>
            <MdSearch
              size={24}
              onClick={() => {
                setIsSearchOpen(!isSearchOpen);
                setSearchKey("");
                setSearchComplete(false);
              }}
              cursor={"pointer"}
            />

            <Link
              as={RouterLink}
              to={RouteNames.home.path + `${user.username}`}
            >
              <RxAvatar size={24} />
            </Link>

            <Link as={RouterLink} to={RouteNames.chat.path}>
              <BsFillChatQuoteFill size={20} />
            </Link>

            <Link as={RouterLink} to={RouteNames.settings.path}>
              <MdOutlineSettings size={20} />
            </Link>

            <Button size={"sm"} onClick={logout}>
              {/* Logout */}
              <MdOutlineLogout size={20} />
            </Button>
          </Flex>
        )}
      </Flex>

      {isSearchOpen && (
        <Box
          mb={12}
          id="overlay"
          className="overlay"
          w={{
            base: "22rem",
            md: "37rem",
          }}
          ref={searchBoxRef}
        >
          <form onSubmit={handleSearchUsers}>
            <InputGroup>
              <Input
                w={"full"}
                placeholder="Search people..."
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
              />
              <InputRightElement>
                <IoSearch cursor={"pointer"} onClick={handleSearchUsers} />
              </InputRightElement>
            </InputGroup>
          </form>

          <Flex direction={"column"} mt={2} maxH={"400px"} overflowY={"auto"}>
            {searchResult.map((searchUser: any, i: any) => (
              <Box
                h={10}
                display={"flex"}
                alignItems={"center"}
                border={"1px solid #66666654"}
                key={i}
                gap={2}
                p={5}
                pt={8}
                pb={8}
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchResult([]);
                  navigate(`/${searchUser.username}`);
                }}
                cursor={"pointer"}
                _hover={{ bg: "#1e1e1e" }}
              >
                <WrapItem>
                  <Avatar
                    size={{
                      base: "xs",
                      sm: "sm",
                      md: "md",
                    }}
                    name={searchUser?.username}
                    src={searchUser?.profilePic}
                  ></Avatar>
                </WrapItem>
                <Flex direction={"column"}>
                  <Text>{searchUser.username}</Text>
                  <Text fontSize={"12px"} color={"gray.light"}>
                    {searchUser.name}
                  </Text>
                </Flex>
              </Box>
            ))}

            {searchComplete && searchResult.length === 0 && (
              <Box
                h={10}
                display={"flex"}
                alignItems={"center"}
                border={"1px solid #66666654"}
                gap={2}
                p={5}
                pt={8}
                pb={8}
                cursor={"pointer"}
                _hover={{ bg: "#1e1e1e" }}
              >
                <Flex>
                  <Text>No result found</Text>
                </Flex>
              </Box>
            )}

            {searchLoading && (
              <Flex justifyContent={"center"} h={20} alignItems={"center"}>
                <Spinner />
              </Flex>
            )}
          </Flex>
        </Box>
      )}
    </>
  );
}

export default Header;
