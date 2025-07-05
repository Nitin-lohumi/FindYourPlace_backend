import axios from "axios";
async function GetPlaceDetails(placeId) {
    const options = {
        method: 'GET',
        url: `https://google-map-places-new-v2.p.rapidapi.com/v1/places/${placeId}`,
        headers: {
            'x-rapidapi-key': process.env.RAPID_API_FOR_PlaceDetails,
            'x-rapidapi-host': 'google-map-places-new-v2.p.rapidapi.com',
            'X-Goog-FieldMask': '*'
        }
    };
    try {
        const response = await axios.request(options);
        let res = response.data;
        const format = ProperFormat(res);
        return format;
    } catch (error) {
        console.error(error);
    }
}
export default GetPlaceDetails;



function ProperFormat(place) {
    return {
        id: place.id,
        plusCode: place.plusCode,
        nationalPhoneNumber: place.nationalPhoneNumber,
        internationalPhoneNumber: place.internationalPhoneNumber,
        formattedAddress: place.formattedAddress,
        addressComponents: place?.addressComponents[0],
        googleMapsUri: place.googleMapsUri,
        businessStatus: place.businessStatus,
        userRatingCount: place.userRatingCount,
        primaryTypeDisplayName: place.primaryTypeDisplayName,
        delivery: place.delivery,
        primaryType: place.primaryType,
        shortFormattedAddress: place.shortFormattedAddress,
        pureServiceAreaBusiness: place.pureServiceAreaBusiness,
        locality: place.locality,
        addressLines: place.addressLines
    };
}
