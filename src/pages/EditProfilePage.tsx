import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  //   HStack,
  Avatar,
  //   AvatarBadge,
  //   IconButton,
  Center,
} from "@chakra-ui/react";
// import { SmallCloseIcon } from "@chakra-ui/icons";
import { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";
import customFetch from "../api";

export default function EditProfilePage(): JSX.Element {
  const [user, setUser] = useRecoilState(userAtom);

  const fileRef = useRef<any>(null);
  const { handleImgChange, imgUrl } = usePreviewImg();

  const showToast = useShowToast();

  const [inputs, setInputs] = useState<{
    name: string;
    username: string;
    email: string;
    bio: string;
    profilePic: string;
  }>({
    name: user?.name,
    username: user?.username,
    email: user?.email,
    bio: user?.bio,
    profilePic: user?.profilePic,
  });
  const [updating, setUpdating] = useState(false);

  const handleValueChange = (name: string) => (e: any) => {
    setInputs({
      ...inputs,
      [name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setUpdating(true);

    try {
      if (updating) return;
      const res = await customFetch("/api/v1/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
      });

      const data = await res.json();

      if (data?.error) {
        return showToast("Error", data.message, "error", 3000, false);
      }

      localStorage.setItem("user-upside", JSON.stringify(data?.data));
      setUser(data?.data);

      showToast("Success", data.message, "success", 3000, false);
    } catch (error) {
      showToast("Error", "Something went wrong", "error", 3000, false);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.dark")}
      >
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            User Profile Edit
          </Heading>

          <FormControl id="userName">
            <FormLabel>User Icon</FormLabel>
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar
                  size="xl"
                  src={imgUrl || user?.profilePic}
                  boxShadow={"md"}
                >
                  {/* <AvatarBadge
                    as={IconButton}
                    size="sm"
                    rounded="full"
                    top="-10px"
                    colorScheme="red"
                    aria-label="remove Image"
                    icon={<SmallCloseIcon />}
                  /> */}
                </Avatar>
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileRef.current!.click()}>
                  Change Picture
                </Button>
                <Input
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={handleImgChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl id="name" isRequired>
            <FormLabel>Full name</FormLabel>
            <Input
              placeholder="Name"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={inputs?.name}
              onChange={handleValueChange("name")}
            />
          </FormControl>
          <FormControl id="userName" isRequired>
            <FormLabel>User name</FormLabel>
            <Input
              placeholder="Username"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={inputs?.username}
              onChange={handleValueChange("username")}
            />
          </FormControl>
          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              _placeholder={{ color: "gray.500" }}
              type="email"
              value={inputs?.email}
              onChange={handleValueChange("email")}
            />
          </FormControl>
          <FormControl id="bio" isRequired>
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder="Bio"
              _placeholder={{ color: "gray.500" }}
              type="text"
              value={inputs?.bio}
              onChange={handleValueChange("bio")}
            />
          </FormControl>
          {/* <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              _placeholder={{ color: 'gray.500' }}
              type="password"
            />
          </FormControl> */}
          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
            >
              Cancel
            </Button>
            <Button
              bg={"green.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "blue.500",
              }}
              type="submit"
              isLoading={updating}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
