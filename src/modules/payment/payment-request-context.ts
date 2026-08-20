const CREATE_QR_CONTEXT_VERSION = 'payment.create-qr.v2';

export function createQrRequestContext(
  orderId: string,
  orderUserId: string,
  amount: number,
): string {
  return JSON.stringify([
    CREATE_QR_CONTEXT_VERSION,
    orderId,
    orderUserId,
    amount,
  ]);
}
