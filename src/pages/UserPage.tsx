import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import userPostsAtom from "../atoms/userPostsAtom";

function UserPage() {
  const showToast = useShowToast();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const [notFound, setNotFound] = useState(false);
  
  const { username } = useParams();
  
  const fetchUserPosts = async () => {
    try {
      // Fetch user data
      const res = await fetch(`/api/v1/post/user/${username}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data?.error) {
        return showToast("Error", data.message, "error", 3000, false);
      }

      setPosts(data?.data?.posts);
    } catch (error) {
      return showToast("Error", "Something went wrong", "error", 3000, false);
    } finally {
      setPostsLoading(false);
    }
  };
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data
        const res = await fetch(`/api/v1/user/${username}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (data?.error) {
          if (data.code === 404) {
            setNotFound(true);
          }
        } else {
          setUser(data?.data);
        }
      } catch (error) {
        console.log("In error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
    fetchUserPosts();
  }, [username]);

  const [postsLoading, setPostsLoading] = useState(true);
  const [posts, setPosts] = useRecoilState(userPostsAtom);


  return (
    <div>
      {!user && loading && (
        <Flex justifyContent={"center"}>
          <Spinner size={"xl"} />
        </Flex>
      )}

      {!loading && (
        <>
          {!notFound ? (
            <>
              <UserHeader user={user as any} />

              {postsLoading && (
                <Flex justifyContent={"center"} alignItems={"center"} my={10}>
                  <Spinner size={"lg"} />
                </Flex>
              )}

              {posts?.length === 0 && !postsLoading && (
                <Text fontSize={"2xl"} textAlign={"center"} my={10}>
                  No posts yet
                </Text>
              )}

              {posts?.length > 0 &&
                !postsLoading &&
                posts?.map((post: any) => (
                  <Post post={post} key={post._id} refetchPosts={fetchUserPosts} />
                ))}
            </>
          ) : (
            <Text fontSize={"2xl"} fontWeight={"bold"} textAlign={"center"}>
              Sorry, this page isn't available
            </Text>
          )}
        </>
      )}
    </div>
  );
}

export default UserPage;
