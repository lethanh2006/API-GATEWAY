const CREATE_QR_CONTEXT_VERSION = 'payment.create-qr.v1';

export function createQrRequestContext(
  orderId: string,
  amount: number,
): string {
  return JSON.stringify([CREATE_QR_CONTEXT_VERSION, orderId, amount]);
}
