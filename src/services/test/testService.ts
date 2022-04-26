const url = process.env.REACT_APP_SERVER_URL;

const testService = {
    description: 'bla',
    createRoom: async (): Promise<{ success: boolean; data: string }> =>
        fetch(`http://${url}/room`, { method: 'POST' })
            .then((response) => {
                if (response.status !== 200) {
                    return { success: false, data: response.status };
                }
                return response.json().then((res) => ({ success: true, data: res }));
            })
            .catch((err) => err),
};

export default testService;
