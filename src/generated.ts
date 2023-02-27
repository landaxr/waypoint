// Generated by @wagmi/cli@0.1.10 on 2/27/2023 at 11:34:17 AM
import {
  useContract,
  UseContractConfig,
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
  useContractEvent,
  UseContractEventConfig,
} from 'wagmi'
import {
  ReadContractResult,
  WriteContractMode,
  PrepareWriteContractResult,
} from 'wagmi/actions'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// WayPoint
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export const wayPointABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: 'name_', internalType: 'string', type: 'string' },
      { name: 'symbol_', internalType: 'string', type: 'string' },
    ],
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'approved',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'operator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'approved', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'ApprovalForAll',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: '_index',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: '_uri', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'ChangeURI',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'portalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'targetId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'x', internalType: 'int256', type: 'int256', indexed: false },
      { name: 'y', internalType: 'int256', type: 'int256', indexed: false },
      { name: 'z', internalType: 'int256', type: 'int256', indexed: false },
      { name: 'toX', internalType: 'int256', type: 'int256', indexed: false },
      { name: 'toY', internalType: 'int256', type: 'int256', indexed: false },
      { name: 'toZ', internalType: 'int256', type: 'int256', indexed: false },
    ],
    name: 'PortalUpdate',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'tokenId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
    ],
    name: 'Transfer',
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_index', internalType: 'uint256', type: 'uint256' },
      { name: '_uri', internalType: 'string', type: 'string' },
    ],
    name: 'changeURI',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_tokenId', internalType: 'uint256', type: 'uint256' },
      { name: '_targetId', internalType: 'uint256', type: 'uint256' },
      { name: '_x', internalType: 'int256', type: 'int256' },
      { name: '_y', internalType: 'int256', type: 'int256' },
      { name: '_z', internalType: 'int256', type: 'int256' },
      { name: '_toX', internalType: 'int256', type: 'int256' },
      { name: '_toY', internalType: 'int256', type: 'int256' },
      { name: '_toZ', internalType: 'int256', type: 'int256' },
    ],
    name: 'createPortal',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'getApproved',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'operator', internalType: 'address', type: 'address' },
    ],
    name: 'isApprovedForAll',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [{ name: '_uri', internalType: 'string', type: 'string' }],
    name: 'mintNewSpace',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: '_data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'safeTransferFrom',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'approved', internalType: 'bool', type: 'bool' },
    ],
    name: 'setApprovalForAll',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'spaceCounter',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'portalId', internalType: 'uint256', type: 'uint256' },
      { name: '_targetId', internalType: 'uint256', type: 'uint256' },
      { name: '_x', internalType: 'int256', type: 'int256' },
      { name: '_y', internalType: 'int256', type: 'int256' },
      { name: '_z', internalType: 'int256', type: 'int256' },
      { name: '_toX', internalType: 'int256', type: 'int256' },
      { name: '_toY', internalType: 'int256', type: 'int256' },
      { name: '_toZ', internalType: 'int256', type: 'int256' },
    ],
    name: 'updatePortal',
    outputs: [],
  },
] as const

/**
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export const wayPointAddress = {
  80001: '0x9dB2f20E541412292677aa43e8d09732f3998992',
} as const

/**
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export const wayPointConfig = {
  address: wayPointAddress,
  abi: wayPointABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContract}__ with `abi` set to __{@link wayPointABI}__.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function useWayPoint(
  config: Omit<UseContractConfig, 'abi' | 'address'> & {
    chainId?: keyof typeof wayPointAddress
  } = {} as any,
) {
  return useContract({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    ...config,
  })
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wayPointABI}__.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function useWayPointRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof wayPointABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof wayPointABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof wayPointAddress } = {} as any,
) {
  return useContractRead({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    ...config,
  } as UseContractReadConfig<typeof wayPointABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wayPointABI}__ and `functionName` set to `"balanceOf"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function useWayPointBalanceOf<
  TSelectData = ReadContractResult<typeof wayPointABI, 'balanceOf'>,
>(
  config: Omit<
    UseContractReadConfig<typeof wayPointABI, 'balanceOf', TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof wayPointAddress } = {} as any,
) {
  return useContractRead({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    functionName: 'balanceOf',
    ...config,
  } as UseContractReadConfig<typeof wayPointABI, 'balanceOf', TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wayPointABI}__ and `functionName` set to `"getApproved"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function useWayPointGetApproved<
  TSelectData = ReadContractResult<typeof wayPointABI, 'getApproved'>,
>(
  config: Omit<
    UseContractReadConfig<typeof wayPointABI, 'getApproved', TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof wayPointAddress } = {} as any,
) {
  return useContractRead({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    functionName: 'getApproved',
    ...config,
  } as UseContractReadConfig<typeof wayPointABI, 'getApproved', TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wayPointABI}__ and `functionName` set to `"isApprovedForAll"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function useWayPointIsApprovedForAll<
  TSelectData = ReadContractResult<typeof wayPointABI, 'isApprovedForAll'>,
>(
  config: Omit<
    UseContractReadConfig<typeof wayPointABI, 'isApprovedForAll', TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof wayPointAddress } = {} as any,
) {
  return useContractRead({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    functionName: 'isApprovedForAll',
    ...config,
  } as UseContractReadConfig<
    typeof wayPointABI,
    'isApprovedForAll',
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wayPointABI}__ and `functionName` set to `"name"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function useWayPointName<
  TSelectData = ReadContractResult<typeof wayPointABI, 'name'>,
>(
  config: Omit<
    UseContractReadConfig<typeof wayPointABI, 'name', TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof wayPointAddress } = {} as any,
) {
  return useContractRead({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    functionName: 'name',
    ...config,
  } as UseContractReadConfig<typeof wayPointABI, 'name', TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wayPointABI}__ and `functionName` set to `"ownerOf"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function useWayPointOwnerOf<
  TSelectData = ReadContractResult<typeof wayPointABI, 'ownerOf'>,
>(
  config: Omit<
    UseContractReadConfig<typeof wayPointABI, 'ownerOf', TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof wayPointAddress } = {} as any,
) {
  return useContractRead({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    functionName: 'ownerOf',
    ...config,
  } as UseContractReadConfig<typeof wayPointABI, 'ownerOf', TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wayPointABI}__ and `functionName` set to `"spaceCounter"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function useWayPointSpaceCounter<
  TSelectData = ReadContractResult<typeof wayPointABI, 'spaceCounter'>,
>(
  config: Omit<
    UseContractReadConfig<typeof wayPointABI, 'spaceCounter', TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof wayPointAddress } = {} as any,
) {
  return useContractRead({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    functionName: 'spaceCounter',
    ...config,
  } as UseContractReadConfig<typeof wayPointABI, 'spaceCounter', TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wayPointABI}__ and `functionName` set to `"supportsInterface"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function useWayPointSupportsInterface<
  TSelectData = ReadContractResult<typeof wayPointABI, 'supportsInterface'>,
>(
  config: Omit<
    UseContractReadConfig<typeof wayPointABI, 'supportsInterface', TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof wayPointAddress } = {} as any,
) {
  return useContractRead({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    functionName: 'supportsInterface',
    ...config,
  } as UseContractReadConfig<
    typeof wayPointABI,
    'supportsInterface',
    TSelectData
  >)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wayPointABI}__ and `functionName` set to `"symbol"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function useWayPointSymbol<
  TSelectData = ReadContractResult<typeof wayPointABI, 'symbol'>,
>(
  config: Omit<
    UseContractReadConfig<typeof wayPointABI, 'symbol', TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof wayPointAddress } = {} as any,
) {
  return useContractRead({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    functionName: 'symbol',
    ...config,
  } as UseContractReadConfig<typeof wayPointABI, 'symbol', TSelectData>)
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link wayPointABI}__ and `functionName` set to `"tokenURI"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function useWayPointTokenUri<
  TSelectData = ReadContractResult<typeof wayPointABI, 'tokenURI'>,
>(
  config: Omit<
    UseContractReadConfig<typeof wayPointABI, 'tokenURI', TSelectData>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof wayPointAddress } = {} as any,
) {
  return useContractRead({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    functionName: 'tokenURI',
    ...config,
  } as UseContractReadConfig<typeof wayPointABI, 'tokenURI', TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wayPointABI}__.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function useWayPointWrite<
  TMode extends WriteContractMode,
  TFunctionName extends string,
  TChainId extends number = keyof typeof wayPointAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        TMode,
        PrepareWriteContractResult<typeof wayPointABI, string>['abi'],
        TFunctionName
      > & { address?: `0x${string}`; chainId?: TChainId }
    : UseContractWriteConfig<TMode, typeof wayPointABI, TFunctionName> & {
        abi?: never
        address?: never
        chainId?: TChainId
      } = {} as any,
) {
  return useContractWrite<TMode, typeof wayPointABI, TFunctionName>({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wayPointABI}__ and `functionName` set to `"approve"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function useWayPointApprove<
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof wayPointAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        TMode,
        PrepareWriteContractResult<typeof wayPointABI, 'approve'>['abi'],
        'approve'
      > & {
        address?: `0x${string}`
        chainId?: TChainId
        functionName?: 'approve'
      }
    : UseContractWriteConfig<TMode, typeof wayPointABI, 'approve'> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'approve'
      } = {} as any,
) {
  return useContractWrite<TMode, typeof wayPointABI, 'approve'>({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    functionName: 'approve',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wayPointABI}__ and `functionName` set to `"changeURI"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function useWayPointChangeUri<
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof wayPointAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        TMode,
        PrepareWriteContractResult<typeof wayPointABI, 'changeURI'>['abi'],
        'changeURI'
      > & {
        address?: `0x${string}`
        chainId?: TChainId
        functionName?: 'changeURI'
      }
    : UseContractWriteConfig<TMode, typeof wayPointABI, 'changeURI'> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'changeURI'
      } = {} as any,
) {
  return useContractWrite<TMode, typeof wayPointABI, 'changeURI'>({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    functionName: 'changeURI',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wayPointABI}__ and `functionName` set to `"createPortal"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function useWayPointCreatePortal<
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof wayPointAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        TMode,
        PrepareWriteContractResult<typeof wayPointABI, 'createPortal'>['abi'],
        'createPortal'
      > & {
        address?: `0x${string}`
        chainId?: TChainId
        functionName?: 'createPortal'
      }
    : UseContractWriteConfig<TMode, typeof wayPointABI, 'createPortal'> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'createPortal'
      } = {} as any,
) {
  return useContractWrite<TMode, typeof wayPointABI, 'createPortal'>({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    functionName: 'createPortal',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wayPointABI}__ and `functionName` set to `"mintNewSpace"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function useWayPointMintNewSpace<
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof wayPointAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        TMode,
        PrepareWriteContractResult<typeof wayPointABI, 'mintNewSpace'>['abi'],
        'mintNewSpace'
      > & {
        address?: `0x${string}`
        chainId?: TChainId
        functionName?: 'mintNewSpace'
      }
    : UseContractWriteConfig<TMode, typeof wayPointABI, 'mintNewSpace'> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'mintNewSpace'
      } = {} as any,
) {
  return useContractWrite<TMode, typeof wayPointABI, 'mintNewSpace'>({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    functionName: 'mintNewSpace',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wayPointABI}__ and `functionName` set to `"safeTransferFrom"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function useWayPointSafeTransferFrom<
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof wayPointAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        TMode,
        PrepareWriteContractResult<
          typeof wayPointABI,
          'safeTransferFrom'
        >['abi'],
        'safeTransferFrom'
      > & {
        address?: `0x${string}`
        chainId?: TChainId
        functionName?: 'safeTransferFrom'
      }
    : UseContractWriteConfig<TMode, typeof wayPointABI, 'safeTransferFrom'> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'safeTransferFrom'
      } = {} as any,
) {
  return useContractWrite<TMode, typeof wayPointABI, 'safeTransferFrom'>({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    functionName: 'safeTransferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wayPointABI}__ and `functionName` set to `"setApprovalForAll"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function useWayPointSetApprovalForAll<
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof wayPointAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        TMode,
        PrepareWriteContractResult<
          typeof wayPointABI,
          'setApprovalForAll'
        >['abi'],
        'setApprovalForAll'
      > & {
        address?: `0x${string}`
        chainId?: TChainId
        functionName?: 'setApprovalForAll'
      }
    : UseContractWriteConfig<TMode, typeof wayPointABI, 'setApprovalForAll'> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'setApprovalForAll'
      } = {} as any,
) {
  return useContractWrite<TMode, typeof wayPointABI, 'setApprovalForAll'>({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    functionName: 'setApprovalForAll',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wayPointABI}__ and `functionName` set to `"transferFrom"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function useWayPointTransferFrom<
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof wayPointAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        TMode,
        PrepareWriteContractResult<typeof wayPointABI, 'transferFrom'>['abi'],
        'transferFrom'
      > & {
        address?: `0x${string}`
        chainId?: TChainId
        functionName?: 'transferFrom'
      }
    : UseContractWriteConfig<TMode, typeof wayPointABI, 'transferFrom'> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'transferFrom'
      } = {} as any,
) {
  return useContractWrite<TMode, typeof wayPointABI, 'transferFrom'>({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    functionName: 'transferFrom',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link wayPointABI}__ and `functionName` set to `"updatePortal"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function useWayPointUpdatePortal<
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof wayPointAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        TMode,
        PrepareWriteContractResult<typeof wayPointABI, 'updatePortal'>['abi'],
        'updatePortal'
      > & {
        address?: `0x${string}`
        chainId?: TChainId
        functionName?: 'updatePortal'
      }
    : UseContractWriteConfig<TMode, typeof wayPointABI, 'updatePortal'> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'updatePortal'
      } = {} as any,
) {
  return useContractWrite<TMode, typeof wayPointABI, 'updatePortal'>({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    functionName: 'updatePortal',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wayPointABI}__.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function usePrepareWayPointWrite<TFunctionName extends string>(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wayPointABI, TFunctionName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof wayPointAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    ...config,
  } as UsePrepareContractWriteConfig<typeof wayPointABI, TFunctionName>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wayPointABI}__ and `functionName` set to `"approve"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function usePrepareWayPointApprove(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wayPointABI, 'approve'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof wayPointAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    functionName: 'approve',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wayPointABI, 'approve'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wayPointABI}__ and `functionName` set to `"changeURI"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function usePrepareWayPointChangeUri(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wayPointABI, 'changeURI'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof wayPointAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    functionName: 'changeURI',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wayPointABI, 'changeURI'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wayPointABI}__ and `functionName` set to `"createPortal"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function usePrepareWayPointCreatePortal(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wayPointABI, 'createPortal'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof wayPointAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    functionName: 'createPortal',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wayPointABI, 'createPortal'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wayPointABI}__ and `functionName` set to `"mintNewSpace"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function usePrepareWayPointMintNewSpace(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wayPointABI, 'mintNewSpace'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof wayPointAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    functionName: 'mintNewSpace',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wayPointABI, 'mintNewSpace'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wayPointABI}__ and `functionName` set to `"safeTransferFrom"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function usePrepareWayPointSafeTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wayPointABI, 'safeTransferFrom'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof wayPointAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    functionName: 'safeTransferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wayPointABI, 'safeTransferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wayPointABI}__ and `functionName` set to `"setApprovalForAll"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function usePrepareWayPointSetApprovalForAll(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wayPointABI, 'setApprovalForAll'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof wayPointAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    functionName: 'setApprovalForAll',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wayPointABI, 'setApprovalForAll'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wayPointABI}__ and `functionName` set to `"transferFrom"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function usePrepareWayPointTransferFrom(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wayPointABI, 'transferFrom'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof wayPointAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    functionName: 'transferFrom',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wayPointABI, 'transferFrom'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link wayPointABI}__ and `functionName` set to `"updatePortal"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function usePrepareWayPointUpdatePortal(
  config: Omit<
    UsePrepareContractWriteConfig<typeof wayPointABI, 'updatePortal'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof wayPointAddress } = {} as any,
) {
  return usePrepareContractWrite({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    functionName: 'updatePortal',
    ...config,
  } as UsePrepareContractWriteConfig<typeof wayPointABI, 'updatePortal'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link wayPointABI}__.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function useWayPointEvent<TEventName extends string>(
  config: Omit<
    UseContractEventConfig<typeof wayPointABI, TEventName>,
    'abi' | 'address'
  > & { chainId?: keyof typeof wayPointAddress } = {} as any,
) {
  return useContractEvent({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    ...config,
  } as UseContractEventConfig<typeof wayPointABI, TEventName>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link wayPointABI}__ and `eventName` set to `"Approval"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function useWayPointApprovalEvent(
  config: Omit<
    UseContractEventConfig<typeof wayPointABI, 'Approval'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof wayPointAddress } = {} as any,
) {
  return useContractEvent({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    eventName: 'Approval',
    ...config,
  } as UseContractEventConfig<typeof wayPointABI, 'Approval'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link wayPointABI}__ and `eventName` set to `"ApprovalForAll"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function useWayPointApprovalForAllEvent(
  config: Omit<
    UseContractEventConfig<typeof wayPointABI, 'ApprovalForAll'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof wayPointAddress } = {} as any,
) {
  return useContractEvent({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    eventName: 'ApprovalForAll',
    ...config,
  } as UseContractEventConfig<typeof wayPointABI, 'ApprovalForAll'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link wayPointABI}__ and `eventName` set to `"ChangeURI"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function useWayPointChangeUriEvent(
  config: Omit<
    UseContractEventConfig<typeof wayPointABI, 'ChangeURI'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof wayPointAddress } = {} as any,
) {
  return useContractEvent({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    eventName: 'ChangeURI',
    ...config,
  } as UseContractEventConfig<typeof wayPointABI, 'ChangeURI'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link wayPointABI}__ and `eventName` set to `"PortalUpdate"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function useWayPointPortalUpdateEvent(
  config: Omit<
    UseContractEventConfig<typeof wayPointABI, 'PortalUpdate'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof wayPointAddress } = {} as any,
) {
  return useContractEvent({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    eventName: 'PortalUpdate',
    ...config,
  } as UseContractEventConfig<typeof wayPointABI, 'PortalUpdate'>)
}

/**
 * Wraps __{@link useContractEvent}__ with `abi` set to __{@link wayPointABI}__ and `eventName` set to `"Transfer"`.
 *
 * [__View Contract on Polygon Mumbai Polygon Scan__](https://mumbai.polygonscan.com/address/0x9db2f20e541412292677aa43e8d09732f3998992)
 */
export function useWayPointTransferEvent(
  config: Omit<
    UseContractEventConfig<typeof wayPointABI, 'Transfer'>,
    'abi' | 'address' | 'eventName'
  > & { chainId?: keyof typeof wayPointAddress } = {} as any,
) {
  return useContractEvent({
    abi: wayPointABI,
    address: wayPointAddress[80001],
    eventName: 'Transfer',
    ...config,
  } as UseContractEventConfig<typeof wayPointABI, 'Transfer'>)
}