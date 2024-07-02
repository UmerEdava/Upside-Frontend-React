import { atom } from "recoil";

export const callAtom = atom({
	key: "callAtom",
	default: false,
});

export const incomingCallAtom = atom({
	key: "incomingCallAtom",
	default: false,
});