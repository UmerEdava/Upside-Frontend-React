import { Avatar, Box, Flex, Image, Text } from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { formatDistanceToNow } from "date-fns";

function UserPost({ post }: { post: any }) {

  const { _id, comments, img, text, postedBy, createdAt } = post;

  const navigate = useNavigate();

  return (
    <Link to={`/${postedBy?.username}/post/${_id}`}>
      <Flex gap={3} mb={4} py={5}>
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
        <Flex flex={1} flexDirection={"column"} gap={2}>
          <Flex justifyContent={"space-between"} w={"full"}>
            <Flex w={"full"} alignItems={"center"}>
              <Text fontSize={"sm"} fontWeight={"bold"} onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${postedBy?.username}`);
                }}>
                {postedBy?.username}
              </Text>
              <Image src={"/verified.png"} w={4} h={4} />
            </Flex>
            <Flex gap={4} alignItems={"center"}>
              <Text fontStyle={"sm"} color={"gray.light"}>
              {formatDistanceToNow(new Date(createdAt))} ago
              </Text>
              <BsThreeDots />
            </Flex>
          </Flex>

          <Text fontSize={"sm"}>{text}</Text>

          {img && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image src={img} />
            </Box>
          )}

          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>

          
        </Flex>
      </Flex>
    </Link>
  );
}

export default UserPost;
