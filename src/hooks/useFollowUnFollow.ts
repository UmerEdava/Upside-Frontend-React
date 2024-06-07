import { useState } from 'react'
import { useRecoilState } from 'recoil'
import userAtom from '../atoms/userAtom'
import useShowToast from './useShowToast'

const useFollowUnFollow = ({user}: {user: any}) => {

    const [currentUser, setCurrentUser] = useRecoilState(userAtom)

    const [isFollowing, setIsFollowing] = useState(currentUser?.following?.includes(user?._id))

    const [updating, setUpdating] = useState(false)

    const showToast = useShowToast()

    const handleFollowUnFollowUser = async () => {
        setUpdating(true)
        try {
          const res = await fetch(`/api/v1/user/follow/${user?._id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await res.json();
          if (data?.error) {
            return showToast("Error", data.message, "error", 3000, false);
          }
    
          setIsFollowing(!isFollowing);
    
          let newfollowingList = [...currentUser.following]
    
          if (isFollowing) {
            user.followers.pop()
    
            // Remove this user from following list of current user
            newfollowingList = currentUser.following.filter((following: string) => following !== user._id)
          } else {
            user.followers.push(currentUser._id)
    
            // Add this user to following list of current user
            newfollowingList.push(user._id)
          }
          
          localStorage.setItem("user-upside", JSON.stringify({...currentUser, following: newfollowingList}));
          setCurrentUser({...currentUser, following: newfollowingList})
    
        } catch (error) {
          console.log(error);
        } finally {
          setUpdating(false)
        }
      }
  return {handleFollowUnFollowUser, updating, isFollowing}
}

export default useFollowUnFollow