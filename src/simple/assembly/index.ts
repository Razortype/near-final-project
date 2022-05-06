import { logging, context, u128, RNG, ContractPromiseBatch } from "near-sdk-as";
import { Meeting, meetings, participants } from "./model";

const MAIN_ACCOUNT_ = "razortype.testnet";
const MAX_PARTICIPANT_AMOUNT_ = 10;

// Get specified meeting
export function getMeeting(id: string): Meeting {
  return meetings.getSome(id);
}

// Getting all meetings
export function getAllMeetings(): Array<Meeting> {
  return meetings.values();
}

// Delete expired meeting
export function deleteCompletedMeetings(): string {
  // Delete expired meeting can be only execute by main account
  assert(context.sender == MAIN_ACCOUNT_, "Only developer can delete meetings.");
  meetings.values().forEach((meeting: Meeting) => {
    if (meeting.checkMeetingValidation()) { // check if meeting is expired (10 days)
      // Deleting expired meeting
      meetings.delete(meeting.id);
      // Also participants that related to the expired meeting removing from participant list
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

// Creating a new meeting object
export function createMeeting(): string {
  
  assert(context.attachedDeposit == u128.fromString("2000000000000000000000000"),"Exactly 1 Near should be entered.");
  const meeting = new Meeting();
  meetings.set(meeting.id, meeting);

  return `Meeting is created successfully ID: ${meeting.id}`;
}

// Create a request for join meeting
export function joinMeeting(id: string): string {

  assert(meetings.contains(id), "Meeting does not exist!");
  assert(participants.keys().includes(context.sender) == false, "You have already participated a meeting.")
  
  const meeting = meetings.getSome(id);
  assert(meeting.getParticipantList().length < MAX_PARTICIPANT_AMOUNT_, "Meeting participant amount limited to 10 and it is currently full.");
  assert(meeting.getParticipantList().includes(context.sender) == false, "You have already joined to meeting.");

  meeting.addParticipant();

  return `${context.sender} joined to meeting ${meeting.id}`;
}

// Checking validation of meeting
export function checkValidation(id: string) : string {

  assert(meetings.contains(id), "Meeting does not exist!");
  const meeting = meetings.getSome(id);
  
  if (meeting.getParticipantList().includes(context.sender)) {
    return "You are participating.";
  }
  return "You are not participating.";

}

// Getting all participants for specified meeting
export function getMeetingParticipants(id: string) : Array<string> {

  assert(meetings.contains(id), "Meeting does not exist!");
  const meeting = meetings.getSome(id);
  return meeting.getParticipantList();
}