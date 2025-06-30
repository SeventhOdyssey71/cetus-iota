import { Transaction } from '@iota/iota-sdk/transactions';
import { blitz_PACKAGE_ID } from '@/config/iota.config';

export class TransactionBuilder {
  static createSwapTransaction(params: {
    poolId: string;
    coinTypeA: string;
    coinTypeB: string;
    amountIn: bigint;
    minAmountOut: bigint;
    isAToB: boolean;
    network: 'mainnet' | 'testnet' | 'devnet';
  }) {
    const tx = new Transaction();
    const packageId = blitz_PACKAGE_ID[params.network];

    // For demo purposes, we'll create a simple transfer
    // In production, this would call the actual swap function
    if (params.isAToB) {
      // Split coins for the exact amount
      const [coinToSwap] = tx.splitCoins(tx.gas, [tx.pure(params.amountIn)]);
      
      // In production, this would be:
      // tx.moveCall({
      //   target: `${packageId}::dex::swap_a_to_b`,
      //   typeArguments: [params.coinTypeA, params.coinTypeB],
      //   arguments: [
      //     tx.object(params.poolId),
      //     coinToSwap,
      //     tx.pure(params.minAmountOut),
      //   ],
      // });

      // For demo, just transfer back to sender
      // Note: tx.sender is not available, we'll use a placeholder
      tx.transferObjects([coinToSwap], tx.pure.address('0x0'));
    }

    return tx;
  }

  static createAddLiquidityTransaction(params: {
    poolId: string;
    coinTypeA: string;
    coinTypeB: string;
    amountA: bigint;
    amountB: bigint;
    network: 'mainnet' | 'testnet' | 'devnet';
  }) {
    const tx = new Transaction();
    const packageId = blitz_PACKAGE_ID[params.network];

    // Split coins for liquidity
    const [coinA] = tx.splitCoins(tx.gas, [tx.pure(params.amountA)]);
    const [coinB] = tx.splitCoins(tx.gas, [tx.pure(params.amountB)]);

    // In production:
    // tx.moveCall({
    //   target: `${packageId}::dex::add_liquidity`,
    //   typeArguments: [params.coinTypeA, params.coinTypeB],
    //   arguments: [
    //     tx.object(params.poolId),
    //     coinA,
    //     coinB,
    //   ],
    // });

    return tx;
  }

  static createPoolTransaction(params: {
    coinTypeA: string;
    coinTypeB: string;
    amountA: bigint;
    amountB: bigint;
    feePercentage: number;
    network: 'mainnet' | 'testnet' | 'devnet';
  }) {
    const tx = new Transaction();
    const packageId = blitz_PACKAGE_ID[params.network];

    // Split coins for initial liquidity
    const [coinA] = tx.splitCoins(tx.gas, [tx.pure(params.amountA)]);
    const [coinB] = tx.splitCoins(tx.gas, [tx.pure(params.amountB)]);

    // In production:
    // tx.moveCall({
    //   target: `${packageId}::dex::create_pool`,
    //   typeArguments: [params.coinTypeA, params.coinTypeB],
    //   arguments: [
    //     coinA,
    //     coinB,
    //     tx.pure(params.feePercentage),
    //   ],
    // });

    return tx;
  }
}