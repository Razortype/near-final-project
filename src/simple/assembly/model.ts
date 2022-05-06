import { context, logging, PersistentUnorderedMap, PersistentSet, u128 } from "near-sdk-as";

const stakingPeriod_in_nanosec:u64 = 10 * 24 * 60 * 60 * 1000000000;

@nearBindgen
export class Meeting {

    id: string;
    meetingOwner: string;
    deployTime: u64;
    
    constructor() {
        this.id = context.blockIndex.toString().slice(2, 8);
        this.meetingOwner = context.sender;
        this.deployTime = context.blockTimestamp;
        participants.set(context.sender, this.id);
    }

    // Adding new participant to participant list
    addParticipant() : void {
        participants.set(context.sender, this.id);
    }

    // Get all participants related to the this meeting
    getParticipantList() : Array<string> {
        var res: Map<string, string> = new Map<string, string>();
        for (let i = 0; i < participants.length; i++) {
            var key : string = participants.keys()[i];
            if (participants.getSome(key) == this.id) {
                res.set(key, participants.getSome(key))
            }
        }
        return res.keys();
    }

    // Checking the validation of meeting is expired or not
    checkMeetingValidation(): boolean {
        return context.blockTimestamp >= this.deployTime + stakingPeriod_in_nanosec;
    }

}

export const meetings = new PersistentUnorderedMap<string, Meeting>("m");
export const participants = new PersistentUnorderedMap<string, string>("p");