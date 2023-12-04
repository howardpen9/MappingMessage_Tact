import { toNano, beginCell, Address } from "ton";
import {
    Blockchain,
    SandboxContract,
    TreasuryContract,
    printTransactionFees,
    prettyLogTransactions,
} from "@ton-community/sandbox";
import "@ton-community/test-utils";

import { ReceiveWallet_1 } from "./output/sample_ReceiveWallet_1";
import { ReceiveWallet_2 } from "./output/sample_ReceiveWallet_2";

describe("contract", () => {
    const OFFCHAIN_CONTENT_PREFIX = 0x01;
    const string_first = "https://s.getgems.io/nft-staging/c/628f6ab8077060a7a8d52d63/";
    let newContent = beginCell().storeInt(OFFCHAIN_CONTENT_PREFIX, 8).storeStringRefTail(string_first).endCell();

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let sender: SandboxContract<TreasuryContract>;

    let contract_1: SandboxContract<ReceiveWallet_1>;
    let contract_2: SandboxContract<ReceiveWallet_2>;

    beforeAll(async () => {
        blockchain = await Blockchain.create();
        deployer = await blockchain.treasury("deployer");
        sender = await blockchain.treasury("sender");
        contract_1 = blockchain.openContract(await ReceiveWallet_1.fromInit(deployer.address));
        contract_2 = blockchain.openContract(await ReceiveWallet_2.fromInit(deployer.address));

        const deploy_result = await contract_1.send(
            deployer.getSender(),
            { value: toNano(1) },
            {
                $$type: "OwnershipAssigned",
                query_id: 0n,
                prev_owner: sender.address,
                forward_payload: beginCell().endCell(),
            }
        );
        expect(deploy_result.transactions).toHaveTransaction({
            from: deployer.address,
            to: contract_1.address,
            deploy: true,
            success: true,
        });
        console.log(printTransactionFees(deploy_result.transactions));
        // console.log(prettyLogTransactions(deploy_result.transactions));

        const deploy_result_2 = await contract_2.send(
            deployer.getSender(),
            { value: toNano(1) },
            {
                $$type: "OwnershipAssigned",
                query_id: 0n,
                prev_owner: sender.address,
                forward_payload: beginCell().endCell(),
            }
        );
        expect(deploy_result_2.transactions).toHaveTransaction({
            from: deployer.address,
            to: contract_2.address,
            deploy: true,
            success: true,
        });
        console.log(printTransactionFees(deploy_result_2.transactions));
        // console.log(prettyLogTransactions(deploy_result_2.transactions));
    });

    it("Test", async () => {
        let result = await contract_1.getGetRecord();

        // If Dictionary provides a way to iterate over keys and values
        result.keys().forEach((key) => {
            const value = result.get(key);
            console.log(`Key: ${key.toString()}, \n Value: ${value!!.toString()}`);
        });

        let result_2 = await contract_2.getGetRecord_2();
        result_2.keys().forEach((key_2) => {
            const value = result_2.get(key_2);
            console.log(`Key: ${key_2.toString()}, \n Value: ${value!!.toString()}`);
        });
    });

    // it("Second", async () => {
    //     const deploy_result = await contract.send(
    //         deployer.getSender(),
    //         { value: toNano(1) },
    //         {
    //             $$type: "OwnershipAssigned",
    //             query_id: 0n,
    //             prev_owner: sender.address,
    //             forward_payload: beginCell().endCell(),
    //         }
    //     );
    // } )

    // it("should deploy correctly", async () => {
    //     let current_index = (await collection.getGetCollectionData()).next_item_index;

    //     const deploy_result = await collection.send(deployer.getSender(), { value: toNano(13) }, "Mint"); // Send Mint Transaction
    //     expect(deploy_result.transactions).toHaveTransaction({
    //         from: deployer.address,
    //         to: collection.address,
    //         success: true,
    //     });

    //     let next_index = (await collection.getGetCollectionData()).next_item_index;
    //     expect(next_index).toEqual(current_index + 1n);
    //     // console.log("Next IndexID: " +);
    //     // console.log(printTransactionFees(deploy_result.transactions));
    //     // console.log(prettyLogTransactions(deploy_result.transactions));
    // });
});
