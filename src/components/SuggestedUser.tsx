import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useFollowUnFollow from "../hooks/useFollowUnFollow";

const SuggestedUser = ({ user }: { user: any }) => {

    const {handleFollowUnFollowUser, updating, isFollowing} = useFollowUnFollow({user})

	return (
		<Flex gap={2} justifyContent={"space-between"} alignItems={"center"}>
			{/* left side */}
			<Flex gap={2} as={Link} to={`${user.username}`}>
				<Avatar src={user.profilePic} />
				<Box>
					<Text fontSize={"sm"} fontWeight={"bold"}>
						{user.username}
					</Text>
					<Text color={"gray.light"} fontSize={"sm"}>
						{user.name}
					</Text>
				</Box>
			</Flex>
			{/* right side */}
			<Button
				size={"sm"}
				color={isFollowing ? "black" : "white"}
				bg={isFollowing ? "white" : "blue.400"}
				onClick={handleFollowUnFollowUser}
				isLoading={updating}
				_hover={{
					color: isFollowing ? "black" : "white",
					opacity: ".8",
				}}
			>
				{isFollowing ? "Unfollow" : "Follow"}
			</Button>
		</Flex>
	);
};

export default SuggestedUser;