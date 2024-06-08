import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";

function Actions({ post: post_, refetch }: { post: any, refetch?: any }) {
  const user = useRecoilValue(userAtom);

  const showToast = useShowToast();

  const [liked, setLiked] = useState(post_?.likes.includes(user?._id));
  const [post, setPost] = useState(post_);
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [comment, setComment] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleLikeUnlike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      if (!user)
        return showToast(
          "Error",
          "You need to logged in to react to a post.",
          "error",
          3000,
          false
        );

      const res = await fetch(`/api/v1/post/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: post._id }),
      });
      const data = await res.json();
      if (data?.error) {
        return showToast("Error", data.message, "error", 3000, false);
      }

      if (liked) {
        setPost({
          ...post,
          likes: post?.likes.filter((id: string) => id !== user?._id),
        });
      } else {
        setPost({ ...post, likes: [...post?.likes, user?._id] });
      }

      setLiked(!liked);
    } catch (error) {
      console.log(error);
      showToast("Error", "Something went wrong", "error", 3000, false);
    } finally {
      setIsLiking(false);
    }
  };

  const handleComment = async () => {
    setIsCommenting(true);
    try {
      if (!user)
        return showToast(
          "Error",
          "You need to logged in to react to a post.",
          "error",
          3000,
          false
        );

      const res = await fetch(`/api/v1/post/comment`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId: post._id, text: comment }),
      });
      const data = await res.json();
      if (data?.error) {
        return showToast("Error", data.message, "error", 3000, false);
      }

      setPost({ ...post, comments: [...data?.data?.comments] });

      setComment("");

      if (refetch) {
        refetch();
      }

      onClose();

      showToast("Success", "Comment added successfully", "success", 3000, false);

    } catch (error) {
      showToast("Error", "Something went wrong", "error", 3000, false);
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <Flex flexDirection="column">
      <Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
        <svg
          aria-label="Like"
          color={liked ? "rgb(237, 73, 86)" : ""}
          fill={liked ? "rgb(237, 73, 86)" : "transparent"}
          height="19"
          role="img"
          viewBox="0 0 24 22"
          width="20"
          onClick={handleLikeUnlike}
          cursor={"pointer"}
        >
          <path
            d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
            stroke="currentColor"
            strokeWidth="2"
          ></path>
        </svg>

        <svg
          aria-label="Comment"
          color=""
          fill=""
          height="20"
          role="img"
          viewBox="0 0 24 24"
          width="20"
          cursor={"pointer"}
          onClick={onOpen}
        >
          <title>Comment</title>
          <path
            d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
          ></path>
        </svg>

        <RepostSvg />
        <ShareSvg />
      </Flex>

      <Flex gap={3} alignItems={"center"}>
        <Text color={"gray.light"} fontSize={"sm"}>
          {post?.likes?.length} likes
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize={"sm"}>
          {post?.comments?.length} replies
        </Text>
      </Flex>

      <Modal
      isOpen={isOpen}
      onClose={onClose}
      >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader></ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6} mt={4}>
          <FormControl>
            <Input placeholder='Share your reaction...' value={comment} onChange={(e) => setComment(e.target.value)}/>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' size={"sm"} onClick={handleComment} isLoading={isCommenting} loadingText={"Replying..."}>
            Reply
          </Button>
        </ModalFooter>
      </ModalContent>
      </Modal>
    </Flex>

  );
}

const RepostSvg = () => {
  return (
    <svg
      aria-label="Repost"
      color="currentColor"
      fill="currentColor"
      height="20"
      role="img"
      viewBox="0 0 24 24"
      width="20"
      cursor={"pointer"}
    >
      <title>Repost</title>
      <path
        fill=""
        d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z"
      ></path>
    </svg>
  );
};

const ShareSvg = () => {
  return (
    <svg
      aria-label="Share"
      color=""
      fill="rgb(243, 245, 247)"
      height="20"
      role="img"
      viewBox="0 0 24 24"
      width="20"
      cursor={"pointer"}
    >
      <title>Share</title>
      <line
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
        x1="22"
        x2="9.218"
        y1="3"
        y2="10.083"
      ></line>
      <polygon
        fill="none"
        points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      ></polygon>
    </svg>
  );
};

export default Actions;
