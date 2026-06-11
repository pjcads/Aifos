module.exports = {
    calculateAvailableCredit(customer) {

        customer.available_credit =
            Number(customer.credit_limit || 0) -
            Number(customer.current_cycle_used_credit || 0);

        return customer;
    }
};