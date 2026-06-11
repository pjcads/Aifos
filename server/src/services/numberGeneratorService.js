const db = require('../../db');

class NumberGeneratorService {

    async generateNumber(
        documentType,
        documentDate = new Date()
    ) {

        const connection =
            await db.getConnection();

        try {

            await connection.beginTransaction();

            const yyyy =
                documentDate.getFullYear();

            const mm =
                String(
                    documentDate.getMonth() + 1
                ).padStart(2, '0');

            const dd =
                String(
                    documentDate.getDate()
                ).padStart(2, '0');

            const dateString =
                `${yyyy}-${mm}-${dd}`;

            const formattedDate =
                `${yyyy}${mm}${dd}`;

            const [rows] =
                await connection.query(
                    `
                    SELECT last_sequence
                    FROM document_sequences
                    WHERE document_type = ?
                    AND document_date = ?
                    FOR UPDATE
                    `,
                    [
                        documentType,
                        dateString
                    ]
                );

            let nextSequence = 1;

            if (rows.length === 0) {

                await connection.query(
                    `
                    INSERT INTO
                    document_sequences
                    (
                        document_type,
                        document_date,
                        last_sequence
                    )
                    VALUES
                    (?, ?, ?)
                    `,
                    [
                        documentType,
                        dateString,
                        nextSequence
                    ]
                );

            } else {

                nextSequence =
                    rows[0].last_sequence + 1;

                await connection.query(
                    `
                    UPDATE document_sequences
                    SET last_sequence = ?
                    WHERE document_type = ?
                    AND document_date = ?
                    `,
                    [
                        nextSequence,
                        documentType,
                        dateString
                    ]
                );

            }

            await connection.commit();

            return `${documentType}-${formattedDate}-${String(nextSequence).padStart(6, '0')}`;

        } catch (err) {

            await connection.rollback();
            throw err;

        } finally {

            connection.release();

        }

    }

    async generateTransactionNo() {

        return await this.generateNumber(
            'TXN'
        );

    }

    async generateRefundNo() {

        return await this.generateNumber(
            'RFD'
        );

    }

    async generateGoodsReceiptNo() {

        return await this.generateNumber(
            'GR'
        );

    }

    async generateOrderNo() {

        return await this.generateNumber(
            'ORD'
        );

    }    

}

module.exports = new NumberGeneratorService();