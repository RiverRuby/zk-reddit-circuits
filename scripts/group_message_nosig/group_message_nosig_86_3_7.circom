pragma circom 2.0.2;

include "../../circuits/group_message_nosig.circom";

component main {public [root]} = GroupMembershipMessageNoSign(86, 3, 7);