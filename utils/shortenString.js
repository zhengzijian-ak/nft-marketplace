export const shortenString = (text, startCountNum) => (
    `${text.slice(0, startCountNum)}...`
)

export const shortenAddress = (address) => (
    `${address.slice(0, 5)}...${address.slice(address.length - 4)}`
)