/**
 * PayOS Service - Payment integration
 * Theo SPECS.md Section 7.3 và PayOS docs
 */

const axios = require('axios');
const crypto = require('crypto');

const PAYOS_CLIENT_ID = process.env.PAYOS_CLIENT_ID;
const PAYOS_API_KEY = process.env.PAYOS_API_KEY;
const PAYOS_CHECKSUM_KEY = process.env.PAYOS_CHECKSUM_KEY;
const PAYOS_API_URL = 'https://api-merchant.payos.vn';

/**
 * Create checksum signature for PayOS
 */
function createSignature(data) {
    const sortedKeys = Object.keys(data).sort();
    const signData = sortedKeys.map(key => `${key}=${data[key]}`).join('&');
    return crypto
        .createHmac('sha256', PAYOS_CHECKSUM_KEY)
        .update(signData)
        .digest('hex');
}

/**
 * Create payment link - PayOS API
 */
async function createPaymentLink({ orderId, amount, description }) {
    try {
        // Generate unique orderCode (PayOS requires number)
        const orderCode = Date.now() % 9007199254740991; // Max safe integer

        const data = {
            orderCode,
            amount,
            description: description.slice(0, 25), // PayOS limit
            returnUrl: `${process.env.FRONTEND_URL}/user/thanh-toan/success?orderId=${orderId}`,
            cancelUrl: `${process.env.FRONTEND_URL}/user/thanh-toan/cancel?orderId=${orderId}`,
        };

        // Create signature
        const signatureData = {
            amount: data.amount,
            cancelUrl: data.cancelUrl,
            description: data.description,
            orderCode: data.orderCode,
            returnUrl: data.returnUrl,
        };
        data.signature = createSignature(signatureData);

        const response = await axios.post(
            `${PAYOS_API_URL}/v2/payment-requests`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-client-id': PAYOS_CLIENT_ID,
                    'x-api-key': PAYOS_API_KEY,
                },
            }
        );

        if (response.data.code === '00') {
            return {
                orderCode: String(orderCode),
                checkoutUrl: response.data.data.checkoutUrl,
                qrCode: response.data.data.qrCode,
            };
        } else {
            throw new Error(response.data.desc || 'PayOS error');
        }
    } catch (error) {
        console.error('PayOS createPaymentLink error:', error.response?.data || error.message);
        throw new Error('Không thể tạo link thanh toán');
    }
}

/**
 * Verify webhook signature (PayOS official implementation)
 * https://payos.vn/docs/tich-hop-webhook/kiem-tra-du-lieu-voi-signature/
 */
function sortObjDataByKey(object) {
    return Object.keys(object)
        .sort()
        .reduce((obj, key) => {
            obj[key] = object[key];
            return obj;
        }, {});
}

function convertObjToQueryStr(object) {
    return Object.keys(object)
        .filter((key) => object[key] !== undefined)
        .map((key) => {
            let value = object[key];
            // Sort nested array of objects
            if (value && Array.isArray(value)) {
                value = JSON.stringify(value.map((val) => sortObjDataByKey(val)));
            }
            // Set empty string if null
            if ([null, undefined, 'undefined', 'null'].includes(value)) {
                value = '';
            }
            return `${key}=${value}`;
        })
        .join('&');
}

function verifyWebhookSignature(data, signature) {
    const sortedData = sortObjDataByKey(data);
    const dataQueryStr = convertObjToQueryStr(sortedData);
    const computedSignature = crypto
        .createHmac('sha256', PAYOS_CHECKSUM_KEY)
        .update(dataQueryStr)
        .digest('hex');
    return computedSignature === signature;
}

/**
 * Get payment status
 */
async function getPaymentStatus(orderCode) {
    try {
        const response = await axios.get(
            `${PAYOS_API_URL}/v2/payment-requests/${orderCode}`,
            {
                headers: {
                    'x-client-id': PAYOS_CLIENT_ID,
                    'x-api-key': PAYOS_API_KEY,
                },
            }
        );

        return response.data.data;
    } catch (error) {
        console.error('PayOS getPaymentStatus error:', error.response?.data || error.message);
        throw new Error('Không thể kiểm tra trạng thái thanh toán');
    }
}

/**
 * Cancel payment link - prevents customer from paying on expired order
 */
async function cancelPaymentLink(orderCode) {
    try {
        const response = await axios.post(
            `${PAYOS_API_URL}/v2/payment-requests/${orderCode}/cancel`,
            { cancellationReason: 'Đơn hàng hết hạn thanh toán' },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-client-id': PAYOS_CLIENT_ID,
                    'x-api-key': PAYOS_API_KEY,
                },
            }
        );
        console.log(`✅ PayOS link cancelled for orderCode: ${orderCode}`);
        return response.data;
    } catch (error) {
        // Don't throw - cancellation failure shouldn't block order expiry
        console.error('PayOS cancelPaymentLink error:', error.response?.data || error.message);
    }
}

module.exports = {
    createPaymentLink,
    verifyWebhookSignature,
    getPaymentStatus,
    cancelPaymentLink,
    createSignature,
};
