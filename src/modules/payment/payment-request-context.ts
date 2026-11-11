const CREATE_QR_CONTEXT_VERSION = 'payment.create-qr.v2';

/**
 * Bản sao của hợp đồng ký trong Payment: gắn đơn, chủ đơn và số tiền vào HMAC để chữ ký
 * bị bắt được không dùng lại được cho đơn hoặc số tiền khác. Đổi một bên phải đổi cả hai.
 */
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

const RELEASE_LINKS_CONTEXT_VERSION = 'payment.release-links.v1';

/** Lý do một đơn không còn nhận thanh toán online. */
export type ReleaseReason = 'ORDER_CANCELLED' | 'PAID_IN_CASH';

/**
 * Bản sao hợp đồng ký trong Payment: Gateway chỉ ký ngữ cảnh này sau khi Canteen đã huỷ đơn
 * hoặc đã thu tiền mặt, nên Payment tin chữ ký thay cho việc kiểm quyền người gọi.
 */
export function releaseLinksRequestContext(
  orderId: string,
  reason: ReleaseReason,
): string {
  return JSON.stringify([RELEASE_LINKS_CONTEXT_VERSION, orderId, reason]);
}

const RESOLVE_REFUND_CONTEXT_VERSION = 'payment.refund-resolve.v1';

/** Bản sao hợp đồng ký trong Payment: gắn mã hồ sơ và kết quả, không dùng lại cho hồ sơ khác. */
export function resolveRefundRequestContext(
  caseId: string,
  outcome: RefundOutcome,
): string {
  return JSON.stringify([RESOLVE_REFUND_CONTEXT_VERSION, caseId, outcome]);
}

export type RefundOutcome = 'REFUNDED' | 'DISMISSED';
