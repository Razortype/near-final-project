import { logging, context, u128, RNG, ContractPromiseBatch } from "near-sdk-as";
import { Meeting, meetings, participants } from "./model";

const MAIN_ACCOUNT_ = "razortype.testnet";
const MAX_PARTICIPANT_AMOUNT_ = 10;

export function getMeeting(id: string): Meeting {
  return meetings.getSome(id);
}

export function getAllMeetings(): Array<Meeting> {
  return meetings.values();
}

export function deleteCompletedMeetings(): string {
  assert(context.sender == MAIN_ACCOUNT_, "Only developer can delete meetings.");
  meetings.values().forEach((meeting: Meeting) => {
    if (meeting.checkMeetingValidation()) { // check if meeting day is expired (10 days)
      meetings.delete(meeting.id);
      for (let i: i32 = 0; i < participants.keys().length; i++) {
        let key = participants.keys()[i];
        if (participants.getSome(key) == meeting.id) {
          participants.delete(key);
        }
      }
    }
  });
  return `Expired meetings deleted. ${meetings.length} meeting is in progress.`;
}

export function createMeeting(): string {
  
  // assert(context.attachedDeposit == u128.fromString("2000000000000000000000000"),"Exactly 1 Near should be entered.");
  const meeting = new Meeting();
  meetings.set(meeting.id, meeting);
  
  meeting.setMeetingOwner();

  return `Meeting is created successfully ID: ${meeting.id}`;
}

export function joinMeeting(id: string): string {

  assert(meetings.contains(id), "Meeting does not exist!");
  assert(participants.keys().includes(context.sender) == false, "You have already participated a meeting.")
  
  const meeting = meetings.getSome(id);
  assert(meeting.getParticipantList().length < MAX_PARTICIPANT_AMOUNT_, "Meeting participant amount limited to 10 and it is currently full.");
  assert(meeting.getParticipantList().includes(context.sender) == false, "You have already joined to meeting.");

  meeting.addParticipant();

  return `${context.sender} joined to meeting ${meeting.id}`;
}

export function checkValidation(id: string) : string {

  assert(meetings.contains(id), "Meeting does not exist!");
  const meeting = meetings.getSome(id);
  
  if (meeting.getParticipantList().includes(context.sender)) {
    return "You are participating.";
  }
  return "You are not participating.";

}

export function getMeetingParticipants(id: string) : Array<string> {

  assert(meetings.contains(id), "Meeting does not exist!");
  const meeting = meetings.getSome(id);
  return meeting.getParticipantList()
}