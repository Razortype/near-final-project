# Near Certificated Developer Course
> this project based on [starter--near-sdk-as]("https://github.com/Learn-NEAR/starter--near-sdk-as").

## Near Meeting App
---

This is the app which allowe users to create account and participate existing meeting rooms. Meeting creation initially get deploy time and expires 10 days later. Meeting creation costs 2 Near coin. All meeting is stored in list where meeting datas can be retrieved. Participants can check their validation with passing id of meeting. 


## Install Dependecies
---
```bash
yarn build:release
near dev-deploy ./build/release/simple.wasm
near login
export CONTRACT=<accountId(dev)>
```

# Contract Functions
---
## Get All Meetings
```bash
$ near view $CONTRACT getAllMeetings
```

## Get Meeting
```bash
$ near view $CONTRACT getMeeting '{"id":"<meeting-id>"}'
```

## Create Meeting
```bash
$ near call $CONTRACT createMeeting --accountId <owner-account-id> --amount 2
```

## Join Meeting
```bash
$ near call $CONTRACT joinMeeting '{"id":"<meeting-id>"}' --accountId <account-id>
```

## Get Defined Meeting's Participants
```bash
$ near view $CONTRACT getMeetingParticipants '{"id":"<meeting-id>"}'
```

## Check Validation
```bash
$ near call $CONTRACT checkValidation '{"id":"<meeting-id>"}' --accountId  <account-id>
```

## Delete Expired Meeting
```bash
$ near call $CONTRACT deleteCompletedMeetings --accountId <account-id>
```