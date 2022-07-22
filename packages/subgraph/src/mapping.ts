import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts";
// import {
//   YourContract,
//   SetPurpose,
// } from "../generated/YourContract/YourContract";
import {
	PortalUpdate,
	Transfer,
	ChangeURI
} from "../generated/WayPoint/WayPoint";
import { Portal, Space, MetaNomad } from "../generated/schema";

let ZERO_ADDRESS_STRING = "0x0000000000000000000000000000000000000000";

let ZERO_ADDRESS: Bytes = Bytes.fromHexString(ZERO_ADDRESS_STRING) as Bytes;
let ZERO = BigInt.fromI32(0);
let ONE = BigInt.fromI32(1);

export function handlePortalUpdate(event: PortalUpdate): void {
	let id =
		event.params.tokenId.toString() + "." + event.params.portalId.toString();
	let thisPortal = Portal.load(id);
	if (thisPortal == null) {
		thisPortal = new Portal(id);
	}
	thisPortal.tokenId = event.params.tokenId.toString();
	thisPortal.portalId = event.params.portalId.toString();
	thisPortal.targetId = event.params.targetId.toString();
	thisPortal.x = event.params.x;
	thisPortal.y = event.params.y;
	thisPortal.z = event.params.z;
	thisPortal.toX = event.params.toX;
	thisPortal.toY = event.params.toY;
	thisPortal.toZ = event.params.toZ;
	let thisSpace = Space.load(event.params.tokenId.toString());
	thisPortal.space = thisSpace.id;
	thisPortal.save();
}

export function handleTransfer(event: Transfer): void {
	let from = event.params.from.toHexString();
	let to = event.params.to.toHexString();
	let tokenId = event.params.tokenId.toString();
	let thisSpace = Space.load(tokenId);
	if (thisSpace == null) {
		thisSpace = new Space(tokenId);
		thisSpace.uri = "";
	}

	let thisNomad = MetaNomad.load(to);
	if (thisNomad == null) {
		thisNomad = new MetaNomad(to);
		thisNomad.save();
	}
	thisSpace.owner = thisNomad.id;
	thisSpace.save();
}

export function handleChangeURI(event: ChangeURI): void {
	let id = event.params._index.toString();
	let thisSpace = Space.load(id);
	if (thisSpace == null) {
		thisSpace = new Space(id);
	}
	thisSpace.uri = event.params._uri;
	thisSpace.save();
}

// export function handleSetPurpose(event: SetPurpose): void {
//   let senderString = event.params.sender.toHexString();

//   let sender = Sender.load(senderString);

//   if (sender === null) {
//     sender = new Sender(senderString);
//     sender.address = event.params.sender;
//     sender.createdAt = event.block.timestamp;
//     sender.purposeCount = BigInt.fromI32(1);
//   } else {
//     sender.purposeCount = sender.purposeCount.plus(BigInt.fromI32(1));
//   }

//   let purpose = new Purpose(
//     event.transaction.hash.toHex() + "-" + event.logIndex.toString()
//   );

//   purpose.purpose = event.params.purpose;
//   purpose.sender = senderString;
//   purpose.createdAt = event.block.timestamp;
//   purpose.transactionHash = event.transaction.hash.toHex();

//   purpose.save();
//   sender.save();
// }
