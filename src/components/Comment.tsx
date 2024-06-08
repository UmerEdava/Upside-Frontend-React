import { Avatar, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import userAtom from "../atoms/userAtom";
import { useRecoilValue } from "recoil";
import useShowToast from "../hooks/useShowToast";
import CommentActions from "./CommentActions";

function Comment({
  id,
  comment,
  userAvatar,
  username,
  createdAt,
  postId,
  refetch
}: {
  id: string;
  comment: any;
  userAvatar: string;
  username: string;
  createdAt: string;
  likes: number;
  postId: any;
  refetch?: any;
}) {

  const currentUser = useRecoilValue(userAtom);

  const showToast = useShowToast();

  const [isCommentDeleting, setIsCommentDeleting] = useState(false);

  const handleDeleteComment = (commentId: string) => {
    setIsCommentDeleting(true);
    try {
      fetch(`/api/v1/post/comment?postId=${postId}&commentId=${commentId}`, {
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
            showToast("Success", "Comment deleted successfully", "success", 3000, false);
            setIsCommentDeleting(false);

            if (refetch) {
              refetch();
            }
          }
        })
        .catch((error: any) => {
          console.log(error);
          showToast("Error", "Something went wrong", "error", 3000, false);
          setIsCommentDeleting(false);
        });
    } catch (error) {
      showToast("Error", "Something went wrong", "error", 3000, false);
      setIsCommentDeleting(false);
    }
  };

  return (
    <>
      <Flex gap={4} py={2} my={2} w={"full"}>
        <Avatar size="sm" name={username} src={userAvatar} />
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {username}
            </Text>
            <Flex gap={2} alignItems={"center"}>
              <Text fontSize={"sm"} color={"gray.light"}>
                {createdAt}
              </Text>

              <Menu>
                <MenuButton>
                  <BsThreeDots />
                </MenuButton>
                <MenuList p={0} minW={'5rem'}>
                    <MenuItem fontSize={"sm"} >Report</MenuItem>
                    {currentUser?._id === comment?.userId?._id && <MenuItem onClick={() => handleDeleteComment(id)} color={"red"} fontSize={"sm"} >{isCommentDeleting ? "Deleting..." : "Delete"}</MenuItem>}
                </MenuList>
               </Menu>

              
            </Flex>
          </Flex>
          <Text>{comment?.text}</Text>
          <CommentActions postId={postId} comment={comment} />
        </Flex>
      </Flex>
    </>
  );
}

export default Comment;
