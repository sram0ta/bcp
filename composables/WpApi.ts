interface WpApiResponse {
    [key: string]: any
}

export const WpApi = () => {
    const apiBase: string = 'https://api.b-dp.ru/wp-json/wp/v2'

    const fetchData = async <T = WpApiResponse>(
        endpoint: string,
        params: string = ''
    ): Promise<T | null> => {

        try {
            const response: Response = await fetch(`${apiBase}/${endpoint}/${params}`)
            if (!response.ok) throw new Error('Ошибка сети')
            return await response.json() as T
        } catch (err: unknown) {
            return null
        }
    }

    return { fetchData }
}