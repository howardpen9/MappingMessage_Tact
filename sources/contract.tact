// import "./message.tact";
const minTonsForStorage: Int = ton("0.03");
const gasConsumption: Int = ton("0.03");


contract ReceiveWallet_1 {
    record: map<Address, Address>; 
    admin: Address; 

   init(admin: Address){
        self.admin = admin;
    }
    receive(msg: OwnershipAssigned){ // 0x05138d91
        self.record.set(sender(), msg.prev_owner);
        self.forward(self.admin, "Success".asComment(), false, null);
    }

    get fun get_record(): map<Address, Address> {
        return self.record;
    }
}

contract ReceiveWallet_2 {
    record_2: map<Int, Address>;
    index: Int as uint64 = 0;
    admin: Address; 
    init(admin: Address){
        self.admin = admin;
    }

    receive(msg2: OwnershipAssigned) {
        self.record_2.set(self.index, msg2.prev_owner);
        self.index = self.index + 1;
        self.forward(self.admin, "Success".asComment(), false, null);
    }

    get fun get_record_2(): map<Int, Address> {
        return self.record_2;
    }
}

message(0x05138d91) OwnershipAssigned {
    query_id: Int as uint64;
    prev_owner: Address;
    forward_payload: Slice as remaining;
}