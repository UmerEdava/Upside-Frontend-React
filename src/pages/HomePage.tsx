import { Box, Flex, Link, Spinner, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import SuggestedUsers from "../components/SuggestedUsers";

const HomePage = () => {
  const showToast = useShowToast();

  const [loading, setLoading] = useState(true);
  const [feedPosts, setFeedPosts] = useState<any>([]);

  const fetchFeedPosts = async () => {
    try {
      // Fetch user data
      const res = await fetch(`/api/v1/post/feed`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data?.error) {
        return showToast("Error", data.message, "error", 3000, false);
      }

      console.log("🚀 ~ fetchFeedPosts ~ data?.data?.feedPosts:", data?.data?.feedPosts)
      setFeedPosts(data?.data?.feedPosts);
    } catch (error) {
      return showToast("Error", "Something went wrong", "error", 3000, false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedPosts();
  }, [showToast]);

  return (
    <Flex gap={10} alignItems={'flex-start'}>
     <Box flex={70}>
     {loading && (
        <Flex justifyContent={'center'}>
            <Spinner size="xl" />
        </Flex>
     )}

     {!loading && !feedPosts?.length && (
        <h1 style={{textAlign: 'center'}}>Follow some users to see the feed</h1>
     )}

     {!loading && feedPosts?.length > 0 && (
        feedPosts?.map((post: any) => (
            <Post post={post} key={post._id} refetchPosts={fetchFeedPosts}/>
        ))
     )}
     </Box>

     <Box flex={30} display={{
       base: 'none',
       md: 'block'
     }}>
      <SuggestedUsers/>
     </Box>
    </Flex>
  );
};

export default HomePage;
