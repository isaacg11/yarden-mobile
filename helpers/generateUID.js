export default function generateUID() {    

    // Create a random unique identifier
    const uid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    return uid;
}