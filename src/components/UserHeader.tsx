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
import useFollowUnFollow from "../hooks/useFollowUnFollow";

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

  const {handleFollowUnFollowUser, updating, isFollowing} = useFollowUnFollow({user})

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      showToast("Success", "Link copied", "success", 3000, false);
    });
  };

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
            <Button size={"sm"} onClick={handleFollowUnFollowUser} isLoading={updating}>{isFollowing ? "Unfollow" : "Follow"}</Button>
        )}

        <Flex justifyContent={"space-between"} w={"full"}>
          <Flex alignItems={"center"} gap={2}>
            <Text color={"gray.light"}>{user?.followers.length} Followers</Text>
            <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
            <Text color={"gray.light"}>{user?.following.length} Following</Text>

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
