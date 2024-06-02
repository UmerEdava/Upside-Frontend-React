import { atom } from "recoil";

export const chatsAtom = atom({
	key: "chatsAtom",
	default: [],
});

export const selectedChatAtom = atom({
	key: "selectedChatAtom",
	default: {
        _id: "",
        userId: "",
        username: "",
        profilePic: "",
        notChatted: null
    },
});