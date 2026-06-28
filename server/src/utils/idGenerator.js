const { ulid } = require('ulid');

module.exports = {
    customerId: () => `CUS${ulid()}`,
    productId: () => `PRD${ulid()}`,
    userId: () => `USR${ulid()}`,
    terminalId: () => `TER${ulid()}`,

    transactionId: () => `TRN${ulid()}`,
    transactionLineId: () => `TLN${ulid()}`,

    inventoryMovementId: () => `MOV${ulid()}`,

    inventoryDocumentId: () => `DOC${ulid()}`,

    cashierSessionId: () => `SES${ulid()}`,

    creditTransactionId: () => `CRT${ulid()}`,
    payrollBatchId: () => `PAY${ulid()}`,
    payrollBatchDetailId: () => `PDT${ulid()}`,    

    negativeInventoryApprovalId: () => `NIA${ulid()}`,

    inventoryReconciliationId: () => `REC${ulid()}`,

    goodsReceiptId: () => `GRH${ulid()}`,
    goodsReceiptLineId: () => `GRL${ulid()}`,

    walletAccountId: () => `WAL${ulid()}`,
    walletTransactionId: () => `WTX${ulid()}`,
    walletBarcodeId: () => `WBC${ulid()}`,

    orderId: () => `ORD${ulid()}`,
    orderLineId: () => `ODL${ulid()}`,

    negativeInventoryConsumptionId: () => `NIC${ulid()}`,

    priceId: () => `PRI${ulid()}`,

    categoryId: () => `CAT${ulid()}`,

    configurationDropdownTypeId: () => `CDT${ulid()}`,
    configurationDropdownValueId: () => `CDV${ulid()}`,
    configurationBusinessActionId: () => `ACT${ulid()}`,
    configurationDropdownValueBusinessActionId: () => `DBA${ulid()}`,    
};