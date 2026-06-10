const { ulid } = require('ulid');

module.exports = {
    customerId: () => `CUS${ulid()}`,
    productId: () => `PRD${ulid()}`,
    userId: () => `USR${ulid()}`,
    terminalId: () => `POS${ulid()}`,

    transactionId: () => `TRN${ulid()}`,
    transactionLineId: () => `TLN${ulid()}`,

    inventoryMovementId: () => `MOV${ulid()}`,

    inventoryDocumentId: () => `DOC${ulid()}`,

    cashierSessionId: () => `SES${ulid()}`
};