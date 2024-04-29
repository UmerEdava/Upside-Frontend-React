import UserHeader from "../components/UserHeader"
import UserPost from "../components/UserPost"

function UserPage() {
  return (
    <>
     <UserHeader/>
     <UserPost likes={134} replies={23} postImg={"/post1.png"} postTitle={"Let's change."}/>
     <UserPost likes={134} replies={23} postImg={"/post3.png"} postTitle={"Hfso aosfj."}/>
     <UserPost likes={134} replies={23} postImg={"/post3.png"} postTitle={"Jain the chains."}/>
     <UserPost likes={134} replies={23} postImg={"/post1.png"} postTitle={"Learn from mistakes."}/>
     <UserPost likes={134} replies={23} postImg={"/post3.png"} postTitle={"Its not over."}/>

    </>
  )
}

export default UserPage