pragma circom 2.0.2;

include "../../circuits/group_message.circom";

component main {public [root, msghash]} = GroupMembershipMessageSign(64, 4, 7);