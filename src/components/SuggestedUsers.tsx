import { Box, Flex, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SuggestedUser from "./SuggestedUser";
import useShowToast from "../hooks/useShowToast";

const SuggestedUsers = () => {

  const showToast = useShowToast();

  const [loading, setLoading] = useState(true);
  const [suggestedUsers, setSuggestedUsers] = useState<any>([]);

  const fetchSuggestedUsers = async () => {
    try {
      // Fetch user data
      const res = await fetch(`/api/v1/user/suggested`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data?.error) {
        return showToast("Error", data.message, "error", 3000, false);
      }

      setSuggestedUsers(data?.data);
    } catch (error) {
      return showToast("Error", "Something went wrong", "error", 3000, false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestedUsers();
  }, [showToast]);

  return (
    <>
      <Text mb={4} fontWeight={"bold"}>
        Suggested Users
      </Text>
      <Flex direction={"column"} gap={4}>
        {loading &&
          [...Array(5)].map((_:any, i: any) => (
            <Flex
              key={i}
              gap={2}
              alignItems={"center"}
              p={1}
              borderRadius={"md"}
            >
              <Box>
                <SkeletonCircle size="30" />
              </Box>
              <Flex w={"full"} flexDirection={"column"} gap={2}>
                <Skeleton h={"8px"} w={"80px"} />
                <Skeleton h={"8px"} w={"90px"} />
              </Flex>
              <Flex>
                <Skeleton h={"20px"} w={"60px"} />
              </Flex>
            </Flex>
          ))}

          {!loading && suggestedUsers.map((user: any) => <SuggestedUser key={user?._id} user={user} />)}
      </Flex>
    </>
  );
};

export default SuggestedUsers;
