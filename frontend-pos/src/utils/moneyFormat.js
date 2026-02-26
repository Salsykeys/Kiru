const moneyFormat = (Number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR" 
    }).format(Number);
}

export default moneyFormat