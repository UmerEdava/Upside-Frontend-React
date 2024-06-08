import { Avatar, Box, Flex, Image, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useState } from "react";
import { formatDistanceToNow } from 'date-fns'
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";

function Post({ post, refetchPosts }: { post: any, refetchPosts: any }) {

    const currentUser = useRecoilValue(userAtom)

    const showToast = useShowToast();

  const [isDeleting, setIsDeleting] = useState(false);

  const { _id, comments, img, text, postedBy, createdAt } = post;

  const navigate = useNavigate();

  const handleDeletePost = () => {
    setIsDeleting(true);
    try {
      fetch(`/api/v1/post/${_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data?.error) {
            showToast("Error", data.error, "error", 3000, false);
          } else {
            showToast("Success", "Post deleted successfully", "success", 3000, false);
            setIsDeleting(false);
            refetchPosts();
          }
        })
        .catch((error) => {
          console.log("error:", error)
          showToast("Error", "Something went wrong", "error", 3000, false);
          setIsDeleting(false);
        });
    } catch (error) {
      console.log("error:", error)
      showToast("Error", "Something went wrong", "error", 3000, false);
      setIsDeleting(false);
    }
  };

  return (
    
      <Flex gap={3} mb={4} py={5}>
        {/* <Link to={`/${postedBy?.username}/post/${_id}`}> */}
        <Flex flexDirection={"column"} alignItems={"center"}>
          <Avatar
            size="md"
            name={postedBy?.username}
            src={postedBy?.profilePic}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${postedBy?.username}`);
            }}
          />
          <Box w={"1px"} h={"full"} bg={"gray.light"} my={2}></Box>
          <Box position={"relative"} w={"full"}>
            {comments[0] && (
              <Avatar
                size="xs"
                name="John doe"
                position={"absolute"}
                top={"0px"}
                left={"15px"}
                padding={"2px"}
                src="https://bit.ly/dan-abramov"
              />
            )}

            {comments[1] && (
              <Avatar
                size="xs"
                name="John doe"
                position={"absolute"}
                bottom={"0px"}
                right={"-5px"}
                padding={"2px"}
                src="https://bit.ly/sage-adebayo"
              />
            )}

            {comments[2] && (
              <Avatar
                size="xs"
                name="John doe"
                position={"absolute"}
                bottom={"0px"}
                left={"4px"}
                padding={"2px"}
                src="https://bit.ly/prosper-baba"
              />
            )}
          </Box>
        </Flex>
        {/* </Link> */}

        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>

            <Link to={`/${postedBy?.username}/post/${_id}`}>
            <Flex w={"full"} alignItems={"center"}>
              <Text
                fontSize={"sm"}
                fontWeight={"bold"}
                mr={1}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${postedBy?.username}`);
                }}
              >
                {postedBy?.username}
              </Text>
              <Image src={"/verified.png"} w={4} h={4} />
            </Flex>
            </Link>

            <Flex gap={4} alignItems={"center"}>
              <Text fontSize={"xs"} width={36} textAlign={'right'} color={"gray.light"}>
                {createdAt && formatDistanceToNow(new Date(createdAt))} ago
              </Text>

              <Menu>
                <MenuButton>
                  <BsThreeDots />
                </MenuButton>
                <MenuList p={0} minW={'5rem'}>
                    <MenuItem fontSize={"sm"} >Report</MenuItem>
                    {currentUser?._id === postedBy?._id && <MenuItem onClick={handleDeletePost} color={"red"} fontSize={"sm"} >{isDeleting ? "Deleting..." : "Delete"}</MenuItem>}
                </MenuList>
               </Menu>
            </Flex>
          </Flex>

          <Link to={`/${postedBy?.username}/post/${_id}`}>
          <Text fontSize={"sm"}>{text}</Text>

          {img && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
              mt={2}
            >
              <Image src={img} />
            </Box>
          )}

          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>
          </Link>

          
        </Flex>
      </Flex>
    
  );
}

export default Post;
