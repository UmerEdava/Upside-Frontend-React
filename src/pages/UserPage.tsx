import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import { Flex, Spinner, Text } from "@chakra-ui/react";

function UserPage() {

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const [notFound, setNotFound] = useState(false);

  const { username } = useParams();

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

        setLoading(false);
      } catch (error) {
        console.log("In error", error);
      }
    };

    fetchUserData();
  }, [username]);

  return (
    <>
      {loading && (
        <Flex justifyContent={'center'} alignItems={'center'} w={'full'} h={'full'}>
        <Spinner />
        </Flex>
      )}

      {!loading && (
        <>
          {!notFound ? (
            <>
              <UserHeader user={user as any}/>
              <UserPost
                likes={134}
                replies={23}
                postImg={"/post1.png"}
                postTitle={"Let's change."}
              />
              <UserPost
                likes={134}
                replies={23}
                postImg={"/post3.png"}
                postTitle={"Hfso aosfj."}
              />
              <UserPost
                likes={134}
                replies={23}
                postImg={"/post3.png"}
                postTitle={"Jain the chains."}
              />
              <UserPost
                likes={134}
                replies={23}
                postImg={"/post1.png"}
                postTitle={"Learn from mistakes."}
              />
              <UserPost
                likes={134}
                replies={23}
                postImg={"/post3.png"}
                postTitle={"Its not over."}
              />
            </>
          ) : (
            <Text fontSize={"2xl"} fontWeight={"bold"} textAlign={"center"}>
              Sorry, this page isn't available
            </Text>
          )}
        </>
      )}
    </>
  );
}

export default UserPage;
