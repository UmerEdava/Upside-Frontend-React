import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Text,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Comment from "../components/Comment";

function PostPage() {
  const location = useLocation();
  const state = location.state;
  console.log("🚀 ~ PostPage ~ state:", state);
  const { replies, postImg, postTitle } = state;

  const [liked, setLiked] = useState(false);

  return (
    <>
      <Flex w={"full"} alignItems={"center"} gap={3}>
        <Avatar src="/zuck-avatar.png" size="md" name="Mark Zuckerberg" />
        <Flex>
          <Text fontSize={"sm"} fontWeight={"bold"}>
            Mark Zuckerberg
          </Text>
          <Image src="/verified.png" w={4} h={4} ml={4} />
        </Flex>

        <Flex gap={4} alignItems={"center"}>
          <Text fontSize={"sm"} color={"gray.light"}>
            1d
          </Text>
          <BsThreeDots />
        </Flex>
      </Flex>

      <Text my={3}>{postTitle}</Text>
      {postImg && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={postImg} />
        </Box>
      )}

      <Flex gap={3} my={3}>
        <Actions liked={liked} setLiked={setLiked} />
      </Flex>

      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>
          {replies} Replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}>
          {200 + (liked ? 1 : 0)} Likes
        </Text>
      </Flex>

      <Divider my={4} />

      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text>Get the app to like, reply and post.</Text>
        </Flex>
        <Button>Get</Button>
      </Flex>

      <Divider my={4} />

      <Comment
        comment={"Looks great!!"}
        createdAt={"3d"}
        likes={215}
        username={"umeredava"}
        userAvatar={"https://bit.ly/dan-abramov"}
      />

      <Comment
        comment={"haha asdfaf"}
        createdAt={"3d"}
        likes={215}
        username={"shakthiman"}
        userAvatar={"https://bit.ly/code-beast"}
      />

      <Comment
        comment={"hu husa fhu"}
        createdAt={"3d"}
        likes={215}
        username={"superman"}
        userAvatar={"https://bit.ly/prosper-baba"}
      />

      <Comment
        comment={"am am"}
        createdAt={"3d"}
        likes={215}
        username={"spiderman"}
        userAvatar={"https://bit.ly/ryan-florence"}
      />
    </>
  );
}

export default PostPage;
