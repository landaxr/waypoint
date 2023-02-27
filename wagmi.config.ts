import { defineConfig } from '@wagmi/cli';
import { hardhat, react } from '@wagmi/cli/plugins';
import * as chains from 'wagmi/chains';
import deployedContracts from './deployedContracts.json';

type address = `0x${string}`;

export default defineConfig({
  plugins: [
    hardhat({
      project: './waypoint_contracts/packages/hardhat',
      include: ['WayPoint.sol/**'],
      deployments: {
        WayPoint: {
          // [chains.hardhat.id]: deployedContracts[chains.foundry.id].icoAddress as address,
          // [chains..id]: deployedContracts[chains.rinkeby.id].address as address,
          [chains.polygonMumbai.id]: deployedContracts[chains.polygonMumbai.id].address as address,
        },
      },
    }),
    react({
      useContract: true,
    }),
  ],
  out: 'src/generated.ts',
});
