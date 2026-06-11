const db = require('../../db');

class CustomerInquiryService {

    async getCustomerInquiry(
        customerId
    ) {

        const [customerRows] =
            await db.query(
                `
                SELECT *
                FROM customers
                WHERE id = ?
                `,
                [customerId]
            );

        if (
            customerRows.length === 0
        ) {

            throw new Error(
                'Customer not found'
            );

        }

        const customer =
            customerRows[0];

        const [walletRows] =
            await db.query(
                `
                SELECT *
                FROM wallet_accounts
                WHERE customer_id = ?
                AND status = 'ACTIVE'
                LIMIT 1
                `,
                [customerId]
            );

        const wallet =
            walletRows.length > 0
                ? walletRows[0]
                : null;

        const [barcodeRows] =
            await db.query(
                `
                SELECT
                    barcode,
                    barcode_type,
                    is_primary
                FROM wallet_account_barcodes
                WHERE wallet_id = ?
                AND is_active = 1
                ORDER BY
                    is_primary DESC,
                    barcode_type
                `,
                [
                    wallet
                        ? wallet.id
                        : ''
                ]
            );
                            
        const [salesRows] =
            await db.query(
                `
                SELECT
                    COUNT(*) transaction_count,
                    COALESCE(
                        SUM(total_amount),
                        0
                    ) total_sales
                FROM transaction_headers
                WHERE customer_id = ?
                AND transaction_type = 'SALE'
                `,
                [customerId]
            );

        return {

        customer: {

            id:
                customer.id,

            customerCode:
                customer.customer_code,

            fullName:
                customer.full_name,

            status:
                customer.status

        },

            credit: {

                creditLimit:
                    Number(
                        customer.credit_limit
                    ),

                usedCredit:
                    Number(
                        customer.current_cycle_used_credit
                    ),

                refundCredit:
                    Number(
                        customer.current_cycle_refund_credit
                    ),

                availableCredit:
                    Number(
                        customer.credit_limit
                    )
                    -
                    Number(
                        customer.current_cycle_used_credit
                    )
                    +
                    Number(
                        customer.current_cycle_refund_credit
                    )

            },

            wallet: wallet
                ? {
                    walletId:
                        wallet.id,

                    currentBalance:
                        Number(
                            wallet.current_balance
                        ),

                    status:
                        wallet.status

                }
                : null,

            barcodes:
                barcodeRows.map(
                    x => ({
                        barcode:
                            x.barcode,

                        barcodeType:
                            x.barcode_type,

                        isPrimary:
                            Boolean(
                                x.is_primary
                            )
                    })
                ),

            sales: {

                transactionCount:
                    Number(
                        salesRows[0]
                            .transaction_count
                    ),

                totalSales:
                    Number(
                        salesRows[0]
                            .total_sales
                    )

            }

        };

    }

    async getCustomerInquiryByBarcode(
        barcode
    ) {

        const [rows] =
            await db.query(
                `
                SELECT
                    w.customer_id
                FROM wallet_account_barcodes wb
                INNER JOIN wallet_accounts w
                    ON w.id = wb.wallet_id
                WHERE wb.barcode = ?
                AND wb.is_active = 1
                `,
                [barcode]
            );

        if (
            rows.length === 0
        ) {

            throw new Error(
                'Barcode not found'
            );

        }

        if (
            !rows[0].customer_id
        ) {

            throw new Error(
                'Barcode is not linked to a customer'
            );

        }

        return await this.getCustomerInquiry(
            rows[0].customer_id
        );

    }    

    async getCustomerTransactions(
        customerId
    ) {

        const [rows] =
            await db.query(
                `
                SELECT
                    id,
                    transaction_no,
                    transaction_type,
                    payment_method,
                    total_amount,
                    refund_status,
                    transaction_datetime
                FROM transaction_headers
                WHERE customer_id = ?
                ORDER BY
                    transaction_datetime DESC
                `,
                [customerId]
            );

        return rows;

    }

    async getCustomerCreditTransactions(
        customerId
    ) {

        const [rows] =
            await db.query(
                `
                SELECT
                    id,
                    transaction_type,
                    amount,
                    payroll_status,
                    reference_id,
                    remarks,
                    created_at
                FROM customer_credit_transactions
                WHERE customer_id = ?
                ORDER BY
                    created_at DESC
                `,
                [customerId]
            );

        return rows;

    }

    async getCustomerWalletTransactions(
        customerId
    ) {

        const [rows] =
            await db.query(
                `
                SELECT
                    wt.id,
                    wt.transaction_type,
                    wt.amount,
                    wt.reference_id,
                    wt.remarks,
                    wt.created_at
                FROM wallet_transactions wt
                INNER JOIN wallet_accounts wa
                    ON wa.id = wt.wallet_id
                WHERE wa.customer_id = ?
                ORDER BY
                    wt.created_at DESC
                `,
                [customerId]
            );

        return rows;

    }

}

module.exports = new CustomerInquiryService();