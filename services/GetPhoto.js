import axios from 'axios';

async function FetchPhoto(placeId, photoName, apikey) {
    if (!placeId || !photoName) {
        console.error("Missing placeId or photoName");
        return { photoUri: null };
    }
    const options = {
        method: 'GET',
        url: `https://google-map-places-new-v2.p.rapidapi.com/v1/places/${placeId}/photos/${photoName}/media`,
        params: {
            maxWidthPx: '400',
            maxHeightPx: '400',
            skipHttpRedirect: 'true'
        },
        headers: {
            'x-rapidapi-key': apikey,
            'x-rapidapi-host': 'google-map-places-new-v2.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        return {
            photoUri: response?.data?.photoUri || null
        };
    } catch (error) {
        console.error("FetchPhoto Error:", error?.response?.data || error.message);
        return { photoUri: null };
    }
}

export default FetchPhoto;
