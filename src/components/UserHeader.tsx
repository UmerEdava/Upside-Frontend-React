import {
  Avatar,
  Box,
  Button,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilState, useRecoilValue } from "recoil";
import { Link as RouterLink } from "react-router-dom";
import userAtom from "../atoms/userAtom";
import { RouteNames } from "../routes";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";

// user type
export type User = {
  _id: string;
  name: string;
  username: string;
  profilePic: string;
  bio: string;
  followers: Array<User>;
  following: Array<User>;
};

function UserHeader({ user }: { user: User }) {
  const showToast = useShowToast();

  const [currentUser, setCurrentUser] = useRecoilState(userAtom)

  const [isFollowing, setIsFollowing] = useState(currentUser?.following?.includes(user?._id))
  const [updating, setUpdating] = useState(false)

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast("Success", "Link copied", "success", 3000, false);
    });
  };

  const followUnfollowUser = async () => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/v1/user/follow/${user?._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data?.error) {
        return showToast("Error", data.message, "error", 3000, false);
      }

      setIsFollowing(!isFollowing);

      let newfollowingList = [...currentUser.following]

      if (isFollowing) {
        user.followers.pop()

        // Remove this user from following list of current user
        newfollowingList = currentUser.following.filter((following: string) => following !== user._id)
      } else {
        user.followers.push(currentUser._id)

        // Add this user to following list of current user
        newfollowingList.push(user._id)
      }
      
      localStorage.setItem("user-upside", JSON.stringify({...currentUser, following: newfollowingList}));
      setCurrentUser({...currentUser, following: newfollowingList})

    } catch (error) {
      console.log(error);
    } finally {
      setUpdating(false)
    }
  }

  return (
    <>
      <VStack gap={4} alignItems={"start"}>
        <Flex justifyContent={"space-between"} w={"full"}>
          <Box>
            <Text fontSize={"2xl"} fontWeight={"bold"}>
              {user?.name}
            </Text>
            <Flex gap={2} alignItems={"center"}>
              <Text fontSize={"xs"}>{user?.username}</Text>
              <Text
                fontSize={"sm"}
                bg={"gray.dark"}
                color={"gray.light"}
                p={1}
                borderRadius={"full"}
              >
                threads.net
              </Text>
            </Flex>
          </Box>
          <Box>
            <Avatar name={user?.name} src={user?.profilePic} size={{
              base: "md",
              sm: "lg",
              md: "xl"
            }} />
          </Box>
        </Flex>
        <Text>{user?.bio}</Text>

        {currentUser?._id === user?._id && (
          <Link as={RouterLink} to={RouteNames.editProfile.path} color={"gray.light"}>
            <Button size={"sm"}>Edit Profile</Button>
          </Link>
        )}

        {currentUser?._id !== user?._id && (
            <Button size={"sm"} onClick={followUnfollowUser} isLoading={updating}>{isFollowing ? "Unfollow" : "Follow"}</Button>
        )}

        <Flex justifyContent={"space-between"} w={"full"}>
          <Flex alignItems={"center"} gap={2}>
            <Text color={"gray.light"}>{user?.followers.length} Followers</Text>
            <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
            <Link color={"gray.light"}>instagram.com</Link>
          </Flex>
          <Flex>
            <Box className="icon-container">
              <BsInstagram size={24} cursor={"pointer"} />
            </Box>
            <Box className="icon-container">
              <Menu>
                <MenuButton>
                  <CgMoreO size={24} cursor={"pointer"} />
                </MenuButton>
                <Portal>
                  <MenuList bg={"gray.dark"}>
                    <MenuItem bg={"gray.dark"} onClick={copyUrl}>
                      Copy Link
                    </MenuItem>
                  </MenuList>
                </Portal>
              </Menu>
            </Box>
          </Flex>
        </Flex>

        <Flex w={'full'}>
            <Flex flex={1} justifyContent={'center'} pb={3} cursor={'pointer'} borderBottom={'1.5px solid white'}>
                <Text fontWeight={'bold'} >Threads</Text>
            </Flex>
            <Flex flex={1} justifyContent={'center'} pb={3} cursor={'pointer'} borderBottom={'1px solid gray'} color={'gray.light'}>
                <Text fontWeight={'bold'} >Threads</Text>
            </Flex>
        </Flex>
      </VStack>
    </>
  );
}

export default UserHeader;
