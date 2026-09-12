// Returns handling for OrderDesk.
//
// A return covers one or more lines of an order. A refund against it must be
// approved by a refunds clerk before any money moves.

function openReturn(order, lines) {
  if (lines.length === 0) {
    throw new Error('a return must cover at least one line');
  }

  // Conflict resolution: Preserve both business rules.
  // We first ensure the order itself is not cancelled (ODK-170).
  // If the order is valid, we then filter out ineligible final-clearance items (ODK-141).
  if (order.status === 'cancelled') {
    throw new Error('cannot return against a cancelled order');
  }

  const eligibleLines = lines.filter(line => !line.finalClearance);
  if (eligibleLines.length === 0) {
    throw new Error('cannot return final-clearance items');
  }

  return {
    orderId: order.id,
    lines: eligibleLines,
    refundReason: '',
    raisedAt: new Date().toISOString(),
    approvedBy: null,
    approvedAt: null,
  };
}

function approve(returnRequest, clerkId) {
  return {
    ...returnRequest,
    approvedBy: clerkId,
    approvedAt: new Date().toISOString(),
  };
}

module.exports = { openReturn, approve };
