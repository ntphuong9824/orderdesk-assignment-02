// Returns handling for OrderDesk.
//
// A return covers one or more lines of an order. A refund against it must be
// approved by a refunds clerk before any money moves.

function openReturn(order, lines) {
  if (lines.length === 0) {
    throw new Error('a return must cover at least one line');
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
