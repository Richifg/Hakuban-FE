const url = process.env.REACT_APP_SERVER_URL;
const protocol = process.env.REACT_APP_NODE_ENV === 'development' ? 'http' : 'https';
const fullUrl = `${protocol}://${url}`;

const RoomService = {
    createRoom: async (): Promise<{ success: boolean; data: string }> =>
        fetch(`${fullUrl}/room`, { method: 'POST' })
            .then((response) => {
                if (response.status !== 200) {
                    return { success: false, data: response.status };
                }
                return response.json().then((res) => ({ success: true, data: res }));
            })
            .catch((err) => err),
    wakeUp: async (): Promise<boolean> =>
        fetch(`${fullUrl}/room`, { method: 'GET' })
            .then((res) => {
                if (res.status !== 200) return false;
                else return true;
            })
            .catch(() => false),
};

export default RoomService;
