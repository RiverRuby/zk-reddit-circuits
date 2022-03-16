pragma circom 2.0.2;

include "../../circuits/group_message.circom";

component main {public [root, msghash]} = GroupMembershipMessage(86, 3, 7);