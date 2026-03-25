import Api from './api';

export const handleCheckout = async (cartItems, customer, cartTotal, pointsUsed = 0) => {
    const payload = {
        amount: cartTotal,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.no_telp,
        cartItems: cartItems,
        points_used: pointsUsed
    };

    // Dapatkan snap token dari backend - ini juga sudah menyimpan transaksi 'pending' ke DB
    const response = await Api.post('/api/checkout/snap', payload);
    const snapToken = response.data.data.token;

    // Kembalikan Promise yang resolve saat status pembayaran diketahui
    return new Promise((resolve, reject) => {
        window.snap.pay(snapToken, {
            onSuccess: function (result) {
                // Midtrans popup berhasil (kartu/transfer langsung selesai)
                resolve({ status: 'success', result });
            },
            onPending: function (result) {
                // Pembayaran pending (transfer bank, QRIS belum dikonfirm dsbnya)
                resolve({ status: 'pending', result });
            },
            onError: function (result) {
                reject(new Error(result.status_message || 'Pembayaran gagal'));
            },
            onClose: function () {
                reject(new Error('popup_closed'));
            }
        });
    });
};
