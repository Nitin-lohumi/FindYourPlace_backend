import axios from "axios";
async function GetPlaceDetails(placeId) {
    const options = {
        method: 'GET',
        url: `https://google-map-places-new-v2.p.rapidapi.com/v1/places/${placeId}`,
        headers: {
            'x-rapidapi-key': process.env.RAPID_API,
            'x-rapidapi-host': 'google-map-places-new-v2.p.rapidapi.com',
            'X-Goog-FieldMask': '*'
        }
    };

    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
export default GetPlaceDetails;