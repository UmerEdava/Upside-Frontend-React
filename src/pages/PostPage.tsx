import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Comment from "../components/Comment";
import useShowToast from "../hooks/useShowToast";
import { formatDistanceToNow } from "date-fns";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

function PostPage() {
  const { username, pid } = useParams();

  const showToast = useShowToast();

  const navigate = useNavigate();

  const currentUser = useRecoilValue(userAtom);

  const [post, setPost] = useState<any>();
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPostDetails = async () => {
    try {
      // Fetch user data
      const res = await fetch(`/api/v1/post/${pid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data?.error) {
        return showToast("Error", data.message, "error", 3000, false);
      }

      setPost(data?.data?.post);
    } catch (error) {
      return showToast("Error", "Something went wrong", "error", 3000, false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchPostDetails();
  }, []);

  const handleDeletePost = () => {
    setIsDeleting(true);
    try {
      fetch(`/api/v1/post/${pid}`, {
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
            navigate(`/${username}`)
          }
        })
        .catch((error) => {
          console.log("error:", error)
          showToast("Error", "Something went wrong", "error", 3000, false);
          setIsDeleting(false);
        });
    } catch (error) {
      showToast("Error", "Something went wrong", "error", 3000, false);
      setIsDeleting(false);
    }
  };

  return (
    <>
      {!post && loading && (
        <Flex justifyContent={"center"}>
          <Spinner size={"xl"} />
        </Flex>
      )}

      {!post && !loading && (
        <Text fontSize={"2xl"} textAlign={"center"} my={10}>
          Post not found
        </Text>
      )}

      {!loading && post && (
        <>
          <Flex w={"full"} alignItems={"center"} gap={3}>
            <Avatar src={post?.postedBy?.profilePic} size="md" name={post?.postedBy?.username} />
            <Flex>
              <Text fontSize={"sm"} fontWeight={"bold"}>
                {post?.postedBy?.username}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>

            <Flex gap={4} alignItems={"center"} ml={"auto"}>
              <Text fontSize={"sm"} color={"gray.light"}>
                {formatDistanceToNow(new Date(post?.createdAt))} ago
              </Text>

              <Menu>
                <MenuButton>
                  <BsThreeDots />
                </MenuButton>
                <MenuList p={0} minW={'5rem'}>
                    <MenuItem fontSize={"sm"} >Report</MenuItem>
                    {currentUser?._id === post?.postedBy?._id && <MenuItem onClick={handleDeletePost} color={"red"} fontSize={"sm"} >{isDeleting ? "Deleting..." : "Delete"}</MenuItem>}
                </MenuList>
               </Menu>

              
            </Flex>
          </Flex>

          <Text my={3}>{post?.text}</Text>
          {post?.img && (
            <Box
              borderRadius={6}
              overflow={"hidden"}
              border={"1px solid"}
              borderColor={"gray.light"}
            >
              <Image src={post?.img} />
            </Box>
          )}

          <Flex gap={3} my={3}>
            <Actions post={post} refetch={fetchPostDetails}/>
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

          {post?.comments && post?.comments.length > 0 && post.comments.map((comment: any) => (
            <Comment
              id={comment._id}
              comment={comment}
              createdAt={formatDistanceToNow(new Date(comment.createdAt))}
              likes={comment.likes}
              username={comment.userId?.username}
              userAvatar={comment.userId?.profilePic}
              postId={pid}
              refetch={fetchPostDetails}
            />
          ))}

          {/* <Comment
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
          /> */}
        </>
      )}
    </>
  );
}

export default PostPage;
