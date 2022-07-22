pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// import "../ref-contracts/ComposableTopDown.sol";
// import "@openzeppelin/contracts/access/Ownable.sol"; 
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract WayPoint is ERC721URIStorage {

    struct Portal {
        // targetId is the tokenId which the potral points to
        uint256 targetId;
        int x;
        int y;
        int z;
        int toX;
        int toY;
        int toZ;
    }

    // tokenId -> portal# -> Portal struct
    mapping(uint256 => mapping (uint256 => Portal)) portals;

    mapping(uint256 => uint256) portalCounter;

    // uint256 public portalCounter;

    uint256 public spaceCounter;

     modifier onlyOwner(uint256 _tokenId) {
        require(ownerOf(_tokenId) == msg.sender, "You are not the owner of this space");
        _;
    }

    event PortalUpdate(uint256 tokenId, uint256 portalId, uint256 targetId, int x, int y, int z, int toX, int toY, int toZ); 

    event ChangeURI(uint256 _index, string _uri);

    constructor(string memory name_, string memory symbol_) ERC721 (name_, symbol_)  { 

    }

    function createPortal (uint256 _tokenId, uint256 _targetId, int _x, int _y, int _z, int _toX, int _toY, int _toZ) public onlyOwner(_tokenId) {
        //
        portalCounter[_tokenId]++;
        Portal storage newPortal = portals[_tokenId][portalCounter[_tokenId]];
        // newPortal.targetContract = _targetContract;
        newPortal.targetId = _targetId;
        newPortal.x = _x;
        newPortal.y = _y;
        newPortal.z = _z;
        newPortal.toX = _toX;
        newPortal.toY = _toY;
        newPortal.toZ = _toZ;
        emit PortalUpdate(_tokenId, portalCounter[_tokenId], _targetId, _x, _y, _z, _toX, _toY, _toZ);
    }

    function updatePortal (uint256 _tokenId, uint256 portalId, uint256 _targetId, int _x, int _y, int _z, int _toX, int _toY, int _toZ) public onlyOwner(_tokenId) {
        require(_tokenId <= spaceCounter && _targetId <= spaceCounter, 
        "Token Doesn't Exist");
        require(portalId <= portalCounter[_tokenId] && portalId != 0, "Portal Index Invalid");
        Portal storage thisPortal = portals[_tokenId][portalId];
        thisPortal.targetId = _targetId;
        thisPortal.x = _x;
        thisPortal.y = _y;
        thisPortal.z = _z;
        thisPortal.toX = _toX;
        thisPortal.toY = _toY;
        thisPortal.toZ = _toZ;
        emit PortalUpdate(_tokenId, portalCounter[_tokenId], _targetId, _x, _y, _z, _toX, _toY, _toZ);
    }

    function mintNewSpace(string memory _uri) public {
         _safeMint(msg.sender, spaceCounter);
         changeURI(spaceCounter, _uri);
         spaceCounter++;
    }

    // function updateSpaceURI(uint256 _tokenId, string memory _uri) public onlyOwner(_tokenId) {
    //     require(_tokenId <= spaceCounter, "Space Not Found");
    //     changeURI(_tokenId, _uri);
    // }

    // function getPortals(uint256 _tokenId) public view returns( Portal [] memory) {
    //     require(portalCounter[_tokenId] > 0 , "No Portals");
    //     Portal[] storage tempArr;
    //     for (uint256 i = 0; i++; i<=portalCounter[_tokenId]) {
    //         tempArr.push(portals[i]);
    //     }
    //     return tempArr;
    // }

     function changeURI(uint256 _index, string memory _uri) public onlyOwner(_index)  {
         require(_index <= spaceCounter, "Space Not Found");
        _setTokenURI(_index, _uri);
        emit ChangeURI(_index, _uri);
    }
}
