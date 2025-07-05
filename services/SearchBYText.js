import axios from "axios";
import FetchPhoto from "./GetPhoto.js"
async function getSearchBarText(textQu) {
    const options = {
        method: 'POST',
        url: 'https://google-map-places-new-v2.p.rapidapi.com/v1/places:searchText',
        headers: {
            'x-rapidapi-key': process.env.RAPID_API_FOR_search_text,
            'x-rapidapi-host': 'google-map-places-new-v2.p.rapidapi.com',
            'Content-Type': 'application/json',
            'X-Goog-FieldMask': '*'
        },
        data: {
            textQuery: textQu,
            maxResultCount: 10,
            rankPreference: 0,
            strictTypeFiltering: false
        }
    };
    try {
        const response = await axios.request(options);
        const results = response.data.places || [];
        const formattedResults = await Promise.all(
            results.map(async (place) => {
                const formatted = ProperFormat(place);
                if (place.photos && place.photos.length > 0) {
                    const { placeId, photoName } = extractPlaceIdAndPhotoName(place.photos[0].name);
                    const photo = await FetchPhoto(placeId, photoName, process.env.RAPID_API_FOR_placePhoto1);
                    formatted.originalPhoto = photo?.photoUri || null;
                    await wait(1000);
                } else {
                    formatted.originalPhoto = null;
                }
                return formatted;
            })
        );
        return formattedResults;
    } catch (error) {
        console.error("Error in getSearchBarText:", error?.response?.data || error.message);
        return [];
    }
}
export default getSearchBarText;


function extractPlaceIdAndPhotoName(fullName) {
    const parts = fullName.split("/");
    return {
        placeId: parts[1],
        photoName: parts[3]
    };
}

function ProperFormat(place) {
    return {
        id: place.id,
        types: place.types,
        displayName: place.displayName?.text || '',
        address: place.shortFormattedAddress || place.formattedAddress,
        location: place.location,
        rating: place.rating,
        isOpen: place.currentOpeningHours?.openNow,
        reviews: place.reviews,
        photos: place.photos,
        phone: place.nationalPhoneNumber,
        mapUrl: place.googleMapsUri,
        openingHours: place.regularOpeningHours?.weekdayDescriptions,
        editorialSummary: place.editorialSummary?.text,
        goodForChildren: place.goodForChildren,
        addressDescriptor: place.addressDescriptor,
        googleMapsLinks: place.googleMapsLinks

    };
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}