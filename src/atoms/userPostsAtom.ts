import { atom } from "recoil";

const userPostsAtom = atom({
	key: "userPostsAtom",
	default: [],
});

export default userPostsAtom;