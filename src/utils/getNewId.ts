function getNewId(): string {
    const now = Date.now().toString();
    const random = Math.random().toString(10);
    return random.substring(2, 7) + now.substring(8);
}

export default getNewId;
