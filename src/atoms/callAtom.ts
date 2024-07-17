import { atom } from "recoil";

export const callAtom = atom({
	key: "callAtom",
	default: false,
});

export const incomingCallAtom = atom({
	key: "incomingCallAtom",
	default: false,
});

export const videoCallDetailsAtom = atom({
	key: "videoCallDetailsAtom",
	default: {
		channelName: "",

		callStatus: "",

		callerId: "",
		calleeId: "",
		
		callerName: "",
		callerUsername: "",
		callerProfilePic: "",

		calleeName: "",
		calleeUsername: "",
		calleeProfilePic: "",
	},
});

export const audioCallDetailsAtom = atom({
	key: "audioCallDetailsAtom",
	default: {
		channelName: "",
		callerId: "",
		calleeId: "",
		secondPersonId: "",
		secondPersonName: "",
		secondPersonProfilePic: "",
	},
});