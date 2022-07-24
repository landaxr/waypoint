# w@y_p01nt - Build and Mint a Virtual World, all from the Browser

This project is built for the [2022 HackFS hackathon](https://ethglobal.com/events/hackfs2022), under the project [w@y_p01nt](https://ethglobal.com/showcase/w-y-p01nt-890c8)

The application is entirely serverless, and runs on a single-page react app in the browser, hosted at: [waypoint.on.fleek.co](https://waypoint.on.fleek.co/)

The smart contract can be seen at [landaxr/waypoint_contracts](https://github.com/landaxr/waypoint_contracts)

## High level features:

- Build an interactive 3d virtual world, all from the browser.
  - Drag and drop files to build a 3d metaverse. Current files supported are
    - images of `.jpg` and `.png`
    - movies of type `.mp4`
    - 3d models of type `.glb`
  - Videos have spatial audio
    todo: gif
- Upload an entire virtual world to IPFS. This world is blockchain agnostic and can become part of any erc721 compatible NFT.
  todo: gif
- Load the virtual world from IPFS
- Mint a virtual world as an erc721 compatible NFT to Polygon, or any EVM compatible blockchain.
  todo: gif
- Load the virtual world NFT in any marketplace as an interactive application which is loaded from IPFS.
  todo: gif
- If you are the owner of a world, you can edit it and update the world via a smart contract operation.
  todo: gif
- If you are an owner of a world create an on-chain portal between virtual worlds. Travel through the portal to go to the target world.
  todo: gif

## How it Works 

### Technologies Used

#### IPFS + web3.storage

We use [web3.storage](https://web3.storage/) to store erc721 token metadata, scene graphs, the scene files, assets, and the serverless application

##### Blockchain Agnostic Scene Graphs

When building a scene, and a user drags and drops files into the scene, all those files are stored as local `File` variables. When uploading the scene to ipfs, the scene graph and all of those files uploaded together using the web3storage sdk; This way they are all packaged together into the same folder on ipfs.

- [Code to package and upload a scene to IPFS](/src/api/ipfs/ipfsSceneSaver.ts)
- [Example scene metadata folder on ipfs](https://ipfs.io://ipfs/bafybeihjrtchuf44b5ud6hpnmxqe7n6ff6t5my6ucis6vet6u445fm7eou)

The scene can then be loaded from IPFS directly, without it needing to be tied to a specific token. This would allow these scenes to be **blockchain agnostic**

- [Code to load scene and from ipfs](/src/api/ipfs/ipfsSceneLoader.ts)
- [Example loaded scene](https://waypoint.on.fleek.co/#/worlds/ipfs/bafybeihjrtchuf44b5ud6hpnmxqe7n6ff6t5my6ucis6vet6u445fm7eou)

##### Erc721 Token Metadata

- [Example erc721 metadata](https://ipfs.io/ipfs/bafybeicpqgb4r3pncxzsvpjb73ejjcza2az4f5pzlcgabnzm3feclnl6ja/erc721.json)

- Polygon (or any EVM compatible chain)
- The Graph
- react three fiber

## The MetaToken

Each token has a

## Future Work

- Encryption with

## Tutorial

## How it Works

##

## Local Development Setup
